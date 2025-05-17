"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useNode } from '../../context/node-context'
import { getNodeTemplates } from '../../lib/node-templates'
import NodePreview from './node-preview'

interface NodeListProps {
  category: string;
}

export default function NodeList({ category }: NodeListProps) {
  const { addNode } = useNode()
  const nodes = getNodeTemplates(category)
  
  const onDragStart = (e: React.DragEvent, node: any) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(node))
    e.dataTransfer.effectAllowed = 'move'
  }
  
  return (
    <div className="grid grid-cols-1 gap-2">
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          draggable
          onDragStart={(e) => onDragStart(e, node)}
          className="cursor-grab"
        >
          <NodePreview node={node} />
        </motion.div>
      ))}
    </div>
  )
}