"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Node, Edge, Connection } from 'reactflow'

interface NodeContextType {
  nodes: Node[]
  edges: Edge[]
  updateNodes: React.Dispatch<React.SetStateAction<Node[]>>
  updateEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  onConnect: (connection: Connection) => void
  onNodeDrop: (event: React.DragEvent, position: { x: number; y: number }) => void
  addNode: (node: Node) => void
  deleteNode: (nodeId: string) => void
}

const NodeContext = createContext<NodeContextType | undefined>(undefined)

export function NodeProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const updateNodes = useCallback((nodes: React.SetStateAction<Node[]>) => {
    setNodes(nodes)
  }, [])

  const updateEdges = useCallback((edges: React.SetStateAction<Edge[]>) => {
    setEdges(edges)
  }, [])

  const onConnect = useCallback((connection: Connection) => {
    // Generate a unique ID for the new edge
    const newEdgeId = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Create a new edge with the unique ID and default data
    const newEdge: Edge = {
      ...connection,
      id: newEdgeId,
      type: 'custom',
      data: { state: true } // Default state
    }
    
    setEdges((edges) => [...edges, newEdge])
  }, [])

  const addNode = useCallback((node: Node) => {
    setNodes((nodes) => [...nodes, node])
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId))
    setEdges((edges) => edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ))
  }, [])

  const onNodeDrop = useCallback((event: React.DragEvent, position: { x: number; y: number }) => {
    const nodeData = event.dataTransfer.getData('application/reactflow')
    if (!nodeData) return

    const node = JSON.parse(nodeData)
    const newId = `${node.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    addNode({
      ...node,
      id: newId,
      position,
    })
  }, [addNode])

  return (
    <NodeContext.Provider value={{
      nodes,
      edges,
      updateNodes,
      updateEdges,
      onConnect,
      onNodeDrop,
      addNode,
      deleteNode,
    }}>
      {children}
    </NodeContext.Provider>
  )
}

export function useNode() {
  const context = useContext(NodeContext)
  if (!context) {
    throw new Error('useNode must be used within a NodeProvider')
  }
  return context
}