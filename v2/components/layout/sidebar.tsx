"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Folder, Lock, Network, Server, ShieldAlert, Shield, Webhook, Zap, Terminal } from 'lucide-react'
import NodeList from '../nodes/node-list'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { getFlowTemplates } from '../../lib/node-templates'
import { useNode } from '../../context/node-context'

const attackCategories = [
  { id: 'initial', name: 'Initial Access', icon: Lock, color: 'text-emerald-400' },
  { id: 'reconnaissance', name: 'Reconnaissance', icon: Shield, color: 'text-blue-400' },
  { id: 'exploitation', name: 'Exploitation', icon: Zap, color: 'text-orange-400' },
  { id: 'privilege', name: 'Privilege Escalation', icon: ShieldAlert, color: 'text-red-400' },
  { id: 'lateral', name: 'Lateral Movement', icon: Network, color: 'text-purple-400' },
  { id: 'c2', name: 'Command & Control', icon: Terminal, color: 'text-pink-400' },
  { id: 'exfiltration', name: 'Exfiltration', icon: Webhook, color: 'text-yellow-400' },
  { id: 'persistence', name: 'Persistence', icon: Server, color: 'text-indigo-400' },
]

export default function Sidebar(): React.ReactNode {
  const [collapsed, setCollapsed] = useState(false)
  const { nodes, edges, updateNodes, updateEdges } = useNode()
  const flowTemplates = getFlowTemplates()
  
  const onTemplateDragStart = (e: React.DragEvent, template: any) => {
    e.dataTransfer.setData('application/reactflow-template', JSON.stringify(template))
    e.dataTransfer.effectAllowed = 'move'
  }
  
  return (
    <motion.div
      className={cn(
        "bg-card border-r border-border h-full z-10",
        collapsed ? "w-14" : "w-64"
      )}
      animate={{ width: collapsed ? 56 : 256 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-3 h-14">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Folder className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-mono font-medium">Node Library</h2>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 ml-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <Separator />
        
        {!collapsed ? (
          <ScrollArea className="flex-1 p-3">
            <Tabs defaultValue="nodes">
              <TabsList className="flex w-full">
                <TabsTrigger value="nodes" className="text-xs flex-1">Nodes</TabsTrigger>
                <TabsTrigger value="templates" className="text-xs flex-1">Templates</TabsTrigger>
              </TabsList>
              <TabsContent value="nodes" className="pt-3">
                {attackCategories.map((category) => (
                  <div key={category.id} className="mb-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <category.icon className={cn("h-4 w-4", category.color)} />
                      <h3 className={cn("text-xs font-mono font-medium", category.color)}>
                        {category.name}
                      </h3>
                    </div>
                    <NodeList category={category.id} />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="templates" className="pt-3">
                <div className="flex flex-col space-y-3">
                  {flowTemplates.map((template, index) => {
                    // Alternate between different style variations
                    const variations = [
                      {
                        gradient: 'from-emerald-500/10 to-blue-500/10',
                        border: 'border-emerald-500/30',
                        text: 'text-emerald-400'
                      },
                      {
                        gradient: 'from-purple-500/10 to-pink-500/10',
                        border: 'border-purple-500/30',
                        text: 'text-purple-400'
                      },
                      {
                        gradient: 'from-orange-500/10 to-red-500/10',
                        border: 'border-orange-500/30',
                        text: 'text-orange-400'
                      }
                    ]
                    const style = variations[index % variations.length]
                    
                    return (
                      <motion.div
                        key={template.id}
                        draggable
                        onDragStart={(e) => onTemplateDragStart(e, template)}
                        className={cn(
                          "group relative",
                          "border rounded-lg cursor-grab",
                          "bg-gradient-to-br backdrop-blur-sm",
                          "hover:shadow-lg transition-all duration-200",
                          "hover:scale-[1.02]",
                          style.gradient,
                          style.border
                        )}
                        whileHover={{ y: -2 }}
                      >
                        <div className="p-4">
                          <h4 className={cn(
                            "text-sm font-mono font-medium mb-2",
                            style.text
                          )}>
                            {template.name}
                          </h4>
                          <p className="text-xs text-white/60">
                            {template.description}
                          </p>
                          
                          {/* Template stats */}
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center text-[10px] text-white/40">
                              <Lock className="h-3 w-3 mr-1" />
                              {template.nodes.length} nodes
                            </div>
                            <div className="flex items-center text-[10px] text-white/40">
                              <Network className="h-3 w-3 mr-1" />
                              {template.edges.length} connections
                            </div>
                          </div>
                        </div>
                        
                        {/* Decorative corner accent */}
                        <div className={cn(
                          "absolute -top-px -right-px w-8 h-8",
                          "border-t border-r rounded-tr-lg",
                          style.border
                        )} />
                      </motion.div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center pt-4 space-y-4">
            {attackCategories.map((category) => (
              <Button 
                key={category.id}
                variant="ghost" 
                size="icon"
                className={cn("h-8 w-8", category.color)}
                title={category.name}
              >
                <category.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}