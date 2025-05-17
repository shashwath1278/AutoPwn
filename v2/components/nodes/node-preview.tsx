"use client"

import React from 'react'
import { ArrowRight, ShieldAlert, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NodeData } from '@/types/node'
import { motion } from 'framer-motion'

interface NodePreviewProps {
  node: {
    id: string;
    type: string;
    data: NodeData;
  };
}

export default function NodePreview({ node }: NodePreviewProps) {
  const { type, data } = node
  
  // Custom styling based on category
  const categoryStyles = {
    initial: {
      gradient: 'from-emerald-500/20 to-emerald-700/20',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      text: 'text-emerald-400'
    },
    reconnaissance: {
      gradient: 'from-blue-500/20 to-blue-700/20',
      border: 'border-blue-500/40',
      glow: 'shadow-blue-500/20',
      text: 'text-blue-400'
    },
    exploitation: {
      gradient: 'from-orange-500/20 to-orange-700/20',
      border: 'border-orange-500/40',
      glow: 'shadow-orange-500/20',
      text: 'text-orange-400'
    },
    privilege: {
      gradient: 'from-red-500/20 to-red-700/20',
      border: 'border-red-500/40',
      glow: 'shadow-red-500/20',
      text: 'text-red-400'
    },
    lateral: {
      gradient: 'from-purple-500/20 to-purple-700/20',
      border: 'border-purple-500/40',
      glow: 'shadow-purple-500/20',
      text: 'text-purple-400'
    },
    c2: {
      gradient: 'from-pink-500/20 to-pink-700/20',
      border: 'border-pink-500/40',
      glow: 'shadow-pink-500/20',
      text: 'text-pink-400'
    },
    persistence: {
      gradient: 'from-indigo-500/20 to-indigo-700/20',
      border: 'border-indigo-500/40',
      glow: 'shadow-indigo-500/20',
      text: 'text-indigo-400'
    },
    exfiltration: {
      gradient: 'from-yellow-500/20 to-yellow-700/20',
      border: 'border-yellow-500/40',
      glow: 'shadow-yellow-500/20',
      text: 'text-yellow-400'
    }
  }
  
  const style = categoryStyles[data.category as keyof typeof categoryStyles]
  
  return (
    <motion.div 
      className={cn(
        "relative p-3 rounded-lg backdrop-blur-sm",
        "bg-gradient-to-br",
        style.gradient,
        style.border,
        style.glow,
        "border shadow-lg",
        "hover:scale-[1.02] hover:shadow-xl transition-all duration-200"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "text-sm font-mono font-medium truncate",
          style.text
        )}>
          {data.label}
        </span>
        {data.mitreTechnique && (
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full font-mono",
            "bg-black/30 border border-white/10",
            style.text
          )}>
            {data.mitreTechnique}
          </span>
        )}
      </div>
      
      {data.description && (
        <p className="text-xs text-white/60 line-clamp-2 mb-2">
          {data.description}
        </p>
      )}
      
      {data.defenses && data.defenses.length > 0 && (
        <div className={cn(
          "flex items-center mt-1 text-[10px]",
          "border-t border-white/10 pt-2",
          style.text
        )}>
          <Shield className="h-3 w-3 mr-1" />
          <span>{data.defenses.length} defenses</span>
        </div>
      )}
      
      {/* Decorative corner accent */}
      <div className={cn(
        "absolute -top-px -right-px w-8 h-8",
        "border-t border-r rounded-tr-lg",
        style.border
      )} />
    </motion.div>
  )
}