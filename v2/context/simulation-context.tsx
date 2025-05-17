"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Edge, Node } from 'reactflow'

interface SimulationContextType {
  isPlaying: boolean
  currentStep: number
  wireStates: Record<string, boolean>
  activeNodeIds: string[]
  activeEdgeIds: string[]
  togglePlay: () => void
  stepForward: () => void
  setWireState: (edgeId: string, state: boolean) => void
  getWireState: (edgeId: string) => boolean | undefined
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

export function SimulationProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [wireStates, setWireStates] = useState<Record<string, boolean>>({})
  const [nodes, setNodesState] = useState<Node[]>([])
  const [edges, setEdgesState] = useState<Edge[]>([])
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([])
  const [activeEdgeIds, setActiveEdgeIds] = useState<string[]>([])

  const setNodes = useCallback((newNodes: Node[]) => {
    setNodesState(newNodes)
  }, [])

  const setEdges = useCallback((newEdges: Edge[]) => {
    setEdgesState(newEdges)
  }, [])

  const findStartNodes = useCallback((): string[] => {
    // Find all nodes that have no incoming edges
    return nodes
      .filter(node => !edges.some(edge => edge.target === node.id))
      .map(node => node.id)
  }, [nodes, edges])

  const getNextValidNodes = useCallback((currentNodeIds: string[]): string[] => {
    if (currentNodeIds.length === 0) {
      return findStartNodes()
    }

    const nextNodes: string[] = []
    
    currentNodeIds.forEach(nodeId => {
      // Find all outgoing edges from the current node
      const outgoingEdges = edges.filter(edge => 
        edge.source === nodeId && wireStates[edge.id] !== false
      )
      
      // Add target nodes of valid edges
      outgoingEdges.forEach(edge => {
        if (!nextNodes.includes(edge.target)) {
          nextNodes.push(edge.target)
        }
      })
    })

    return nextNodes
  }, [edges, wireStates, findStartNodes])

  const getActiveEdges = useCallback((currentNodes: string[], nextNodes: string[]): string[] => {
    return edges
      .filter(edge => 
        currentNodes.includes(edge.source) && 
        nextNodes.includes(edge.target) && 
        wireStates[edge.id] !== false
      )
      .map(edge => edge.id)
  }, [edges, wireStates])

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  const stepForward = useCallback(() => {
    setCurrentStep(prev => prev + 1)
  }, [])

  const setWireState = useCallback((edgeId: string, state: boolean) => {
    setWireStates(prev => ({
      ...prev,
      [edgeId]: state
    }))
  }, [])

  const getWireState = useCallback((edgeId: string) => {
    return wireStates[edgeId]
  }, [wireStates])

  // Handle simulation steps
  useEffect(() => {
    if (!isPlaying) {
      setActiveNodeIds([])
      setActiveEdgeIds([])
      return
    }

    const interval = setInterval(() => {
      setActiveNodeIds(prev => {
        const nextNodes = getNextValidNodes(prev)
        
        // Get active edges between current and next nodes
        const activeEdges = getActiveEdges(prev, nextNodes)
        setActiveEdgeIds(activeEdges)
        
        // If no next nodes are found, stop the simulation
        if (nextNodes.length === 0) {
          setIsPlaying(false)
        }

        return nextNodes
      })
    }, 2000) // 2 second interval between steps

    return () => clearInterval(interval)
  }, [isPlaying, getNextValidNodes, getActiveEdges])

  // Reset simulation when stopped
  useEffect(() => {
    if (!isPlaying) {
      setCurrentStep(0)
      setActiveNodeIds([])
      setActiveEdgeIds([])
    }
  }, [isPlaying])

  return (
    <SimulationContext.Provider value={{
      isPlaying,
      currentStep,
      wireStates,
      activeNodeIds,
      activeEdgeIds,
      togglePlay,
      stepForward,
      setWireState,
      getWireState,
      setNodes,
      setEdges,
    }}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}