"use client"

import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Shield, Zap, Lock, Network, Terminal, Webhook, Server, ShieldAlert } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useSimulation } from '../../context/simulation-context'

const categoryIcons = {
  initial: Lock,
  reconnaissance: Shield,
  exploitation: Zap,
  privilege: ShieldAlert,
  lateral: Network,
  c2: Terminal,
  exfiltration: Webhook,
  persistence: Server,
}

const categoryColors = {
  initial: 'rgb(34, 197, 94)', // green
  reconnaissance: 'rgb(59, 130, 246)', // blue
  exploitation: 'rgb(249, 115, 22)', // orange
  privilege: 'rgb(239, 68, 68)', // red
  lateral: 'rgb(168, 85, 247)', // purple
  c2: 'rgb(236, 72, 153)', // pink
  exfiltration: 'rgb(234, 179, 8)', // yellow
  persistence: 'rgb(99, 102, 241)', // indigo
}

function AttackNode({ id, data, selected, isConnectable }: NodeProps) {
  const Icon = categoryIcons[data.category as keyof typeof categoryIcons] || Shield
  const color = categoryColors[data.category as keyof typeof categoryColors]
  const { isPlaying, activeNodeIds } = useSimulation()
  const isActive = isPlaying && activeNodeIds.includes(id)
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: isActive ? 1.05 : 1, 
          opacity: 1,
          boxShadow: isActive ? `0 0 30px ${color}40` : `0 0 20px ${color}20`
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "node p-4 min-w-[200px]",
          `node-${data.category}`,
          selected && "node-selected",
          isActive && "node-active",
          data.state === "success" && "ring-success",
          data.state === "failure" && "ring-failure"
        )}
        style={{
          background: `linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(15, 15, 15, 0.95))`,
          boxShadow: `0 0 20px ${color}20`,
          borderColor: color,
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className={cn(
            "!bg-primary !w-3 !h-3 !border-2",
            isActive && "animate-pulse"
          )}
          style={{ 
            borderColor: color,
            boxShadow: isActive ? `0 0 10px ${color}` : 'none'
          }}
        />
        
        <div className="flex items-center gap-3 mb-3">
          <motion.div 
            className="p-2 rounded-md"
            style={{ background: `${color}20` }}
            animate={{
              scale: isActive ? 1.1 : 1,
              background: isActive ? `${color}30` : `${color}20`
            }}
          >
            <Icon 
              className="h-5 w-5" 
              style={{ 
                color,
                filter: isActive ? `drop-shadow(0 0 5px ${color})` : 'none'
              }} 
            />
          </motion.div>
          <span className={cn(
            "text-sm font-mono font-medium truncate",
            isActive && "glow-text"
          )}>
            {data.label}
          </span>
        </div>
        
        {data.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {data.description}
          </p>
        )}
        
        <div className="flex items-center gap-2">
          {data.mitreTechnique && (
            <motion.span 
              className="text-[10px] px-2 py-1 rounded-full font-mono"
              animate={{
                background: isActive ? `${color}30` : `${color}20`,
                scale: isActive ? 1.05 : 1
              }}
              style={{ 
                color,
                border: `1px solid ${color}40`
              }}
            >
              {data.mitreTechnique}
            </motion.span>
          )}
          
          {data.defenses && data.defenses.length > 0 && (
            <motion.span 
              className="text-[10px] px-2 py-1 rounded-full font-mono"
              animate={{
                background: isActive ? 'rgba(0, 200, 83, 0.3)' : 'rgba(0, 200, 83, 0.2)',
                scale: isActive ? 1.05 : 1
              }}
              style={{ 
                color: 'rgb(0, 200, 83)',
                border: '1px solid rgba(0, 200, 83, 0.4)'
              }}
            >
              {data.defenses.length} defenses
            </motion.span>
          )}
        </div>
        
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className={cn(
            "!bg-primary !w-3 !h-3 !border-2",
            isActive && "animate-pulse"
          )}
          style={{ 
            borderColor: color,
            boxShadow: isActive ? `0 0 10px ${color}` : 'none'
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default memo(AttackNode)