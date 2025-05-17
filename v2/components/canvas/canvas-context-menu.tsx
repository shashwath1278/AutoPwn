"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Copy, Edit } from 'lucide-react'
import { useNode } from '@/context/node-context'

interface CanvasContextMenuProps {
  position: { x: number; y: number }
  onClose: () => void
  nodeId?: string
}

export default function CanvasContextMenu({ position, onClose, nodeId }: CanvasContextMenuProps) {
  const { deleteNode } = useNode()

  return (
    <Card
      className="fixed z-50 min-w-[180px] p-2 shadow-lg"
      style={{
        top: position.y,
        left: position.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {
            // Handle copy
            onClose()
          }}
        >
          <Copy size={16} />
          Copy
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {
            // Handle edit
            onClose()
          }}
        >
          <Edit size={16} />
          Edit
        </Button>
        {nodeId && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={() => {
              deleteNode(nodeId)
              onClose()
            }}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        )}
      </div>
    </Card>
  )
}