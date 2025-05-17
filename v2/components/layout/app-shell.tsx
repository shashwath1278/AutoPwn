"use client"

import React from 'react'
import Toolbar from './toolbar'
import Sidebar from './sidebar'
import Canvas from '../canvas/canvas'
import { NodeProvider } from '../../context/node-context'
import { SimulationProvider } from '../../context/simulation-context'
import { ReactFlowProvider } from 'reactflow'

export default function AppShell() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SimulationProvider>
        <ReactFlowProvider>
          <NodeProvider>
            <Sidebar />
            <div className="flex flex-col flex-1 h-full overflow-hidden">
              <Toolbar />
              <main className="flex-1 relative overflow-hidden">
                <Canvas />
              </main>
            </div>
          </NodeProvider>
        </ReactFlowProvider>
      </SimulationProvider>
    </div>
  )
}