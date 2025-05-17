"use client"

import React from 'react'
import { MiniMap } from 'reactflow'

export default function CanvasMinimap() {
  return (
    <MiniMap
      className="minimap"
      nodeColor="rgba(0, 255, 65, 0.6)"
      maskColor="rgba(0, 0, 0, 0.4)"
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        borderColor: 'rgba(30, 30, 30, 0.8)',
      }}
    />
  )
}