"use client"

import { useEffect, useRef } from "react"
import ReactFlow, { Background, Controls, MiniMap, type Node, type Edge, useNodesState, useEdgesState } from "reactflow"
import "reactflow/dist/style.css"

interface AttackFlowVisualizerProps {
  mode: "pentest" | "ctf"
}

export function AttackFlowVisualizer({ mode }: AttackFlowVisualizerProps) {
  const flowRef = useRef<HTMLDivElement>(null)

  // Define nodes based on mode
  const initialNodes: Node[] =
    mode === "pentest"
      ? [
          {
            id: "1",
            type: "input",
            data: { label: "Target" },
            position: { x: 250, y: 0 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#fff", border: "1px solid rgba(0, 255, 255, 0.5)" },
          },
          {
            id: "2",
            data: { label: "Port Scan" },
            position: { x: 100, y: 100 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#00ffff", border: "1px solid rgba(0, 255, 255, 0.5)" },
          },
          {
            id: "3",
            data: { label: "Service Detection" },
            position: { x: 400, y: 100 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#00ffff", border: "1px solid rgba(0, 255, 255, 0.5)" },
          },
          {
            id: "4",
            data: { label: "Vulnerability Scan" },
            position: { x: 250, y: 200 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#ff00ff", border: "1px solid rgba(255, 0, 255, 0.5)" },
          },
          {
            id: "5",
            data: { label: "CVE-2023-1234" },
            position: { x: 100, y: 300 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#ff0000", border: "1px solid rgba(255, 0, 0, 0.5)" },
          },
          {
            id: "6",
            data: { label: "CVE-2023-5678" },
            position: { x: 400, y: 300 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#ffff00", border: "1px solid rgba(255, 255, 0, 0.5)" },
          },
          {
            id: "7",
            type: "output",
            data: { label: "Shell Access" },
            position: { x: 250, y: 400 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#00ff00", border: "1px solid rgba(0, 255, 0, 0.5)" },
          },
        ]
      : [
          {
            id: "1",
            type: "input",
            data: { label: "CTF Start" },
            position: { x: 250, y: 0 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#fff", border: "1px solid rgba(255, 0, 100, 0.5)" },
          },
          {
            id: "2",
            data: { label: "Web Challenge" },
            position: { x: 100, y: 100 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#ff0064", border: "1px solid rgba(255, 0, 100, 0.5)" },
          },
          {
            id: "3",
            data: { label: "Crypto Challenge" },
            position: { x: 400, y: 100 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#ff0064", border: "1px solid rgba(255, 0, 100, 0.5)" },
          },
          {
            id: "4",
            data: { label: "SQL Injection" },
            position: { x: 100, y: 200 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#ff00ff", border: "1px solid rgba(255, 0, 255, 0.5)" },
          },
          {
            id: "5",
            data: { label: "XSS Attack" },
            position: { x: 250, y: 200 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#ff00ff", border: "1px solid rgba(255, 0, 255, 0.5)" },
          },
          {
            id: "6",
            data: { label: "RSA Decryption" },
            position: { x: 400, y: 200 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#ff00ff", border: "1px solid rgba(255, 0, 255, 0.5)" },
          },
          {
            id: "7",
            data: { label: "Admin Access" },
            position: { x: 175, y: 300 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#00ffff", border: "1px solid rgba(0, 255, 255, 0.5)" },
          },
          {
            id: "8",
            data: { label: "Secret Key" },
            position: { x: 400, y: 300 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#00ffff", border: "1px solid rgba(0, 255, 255, 0.5)" },
          },
          {
            id: "9",
            type: "output",
            data: { label: "Flag Captured" },
            position: { x: 250, y: 400 },
            style: { background: "rgba(0, 0, 0, 0.7)", color: "#00ff00", border: "1px solid rgba(0, 255, 0, 0.5)" },
          },
        ]

  // Define edges based on mode
  const initialEdges: Edge[] =
    mode === "pentest"
      ? [
          { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#00ffff" } },
          { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "#00ffff" } },
          { id: "e2-4", source: "2", target: "4", animated: true, style: { stroke: "#ff00ff" } },
          { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: "#ff00ff" } },
          { id: "e4-5", source: "4", target: "5", animated: true, style: { stroke: "#ff0000" } },
          { id: "e4-6", source: "4", target: "6", animated: true, style: { stroke: "#ffff00" } },
          { id: "e5-7", source: "5", target: "7", animated: true, style: { stroke: "#00ff00" } },
        ]
      : [
          { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#ff0064" } },
          { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "#ff0064" } },
          { id: "e2-4", source: "2", target: "4", animated: true, style: { stroke: "#ff00ff" } },
          { id: "e2-5", source: "2", target: "5", animated: true, style: { stroke: "#ff00ff" } },
          { id: "e3-6", source: "3", target: "6", animated: true, style: { stroke: "#ff00ff" } },
          { id: "e4-7", source: "4", target: "7", animated: true, style: { stroke: "#00ffff" } },
          { id: "e5-7", source: "5", target: "7", animated: true, style: { stroke: "#00ffff" } },
          { id: "e6-8", source: "6", target: "8", animated: true, style: { stroke: "#00ffff" } },
          { id: "e7-9", source: "7", target: "9", animated: true, style: { stroke: "#00ff00" } },
          { id: "e8-9", source: "8", target: "9", animated: true, style: { stroke: "#00ff00" } },
        ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    // Update nodes and edges when mode changes
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [mode, setNodes, setEdges])

  return (
    <div ref={flowRef} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#ffffff" gap={16} size={1} style={{ opacity: 0.05 }} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.style?.color) {
              case "#00ffff":
                return "rgba(0, 255, 255, 0.8)"
              case "#ff00ff":
                return "rgba(255, 0, 255, 0.8)"
              case "#ff0000":
                return "rgba(255, 0, 0, 0.8)"
              case "#ffff00":
                return "rgba(255, 255, 0, 0.8)"
              case "#00ff00":
                return "rgba(0, 255, 0, 0.8)"
              case "#ff0064":
                return "rgba(255, 0, 100, 0.8)"
              default:
                return "rgba(255, 255, 255, 0.8)"
            }
          }}
          maskColor="rgba(0, 0, 0, 0.2)"
          style={{ background: "rgba(0, 0, 0, 0.3)" }}
        />
      </ReactFlow>
    </div>
  )
}
