"use client"

import React from 'react'
import { Node } from 'reactflow'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface RecommendationModalProps {
  node: Node
  open: boolean
  onClose: () => void
}

export default function RecommendationModal({ node, open, onClose }: RecommendationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recommendations for {node.data?.label || 'Node'}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Recommendations will be displayed here based on the selected node.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}