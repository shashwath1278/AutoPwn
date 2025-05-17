"use client"

import React from 'react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Check, X } from 'lucide-react'
import { useSimulation } from '../../context/simulation-context'

interface WireStateMenuProps {
  position: { x: number; y: number }
  edgeId: string
  onClose: () => void
}

export default function WireStateMenu({ position, edgeId, onClose }: WireStateMenuProps) {
  const { setWireState, getWireState } = useSimulation()
  const currentState = getWireState(edgeId)

  return (
    <Card
      className="fixed z-50 p-2 shadow-lg bg-card border border-border"
      style={{
        top: position.y,
        left: position.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 ${currentState !== false ? 'text-success bg-success/10' : 'text-success hover:text-success'}`}
          onClick={() => {
            setWireState(edgeId, true)
            onClose()
          }}
        >
          <Check size={16} />
          YES
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 ${currentState === false ? 'text-destructive bg-destructive/10' : 'text-destructive hover:text-destructive'}`}
          onClick={() => {
            setWireState(edgeId, false)
            onClose()
          }}
        >
          <X size={16} />
          NO
        </Button>
      </div>
    </Card>
  )
}