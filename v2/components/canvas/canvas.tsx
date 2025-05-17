"use client"

import React, { useCallback, useRef, useState, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
  EdgeChange,
  Connection,
  addEdge,
  Panel,
  NodeTypes,
  EdgeTypes,
  BackgroundVariant,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import '../../styles/grid.css'
import { motion } from 'framer-motion'
import { useNode } from '../../context/node-context'
import { useSimulation } from '../../context/simulation-context'
import AttackNode from './attack-node'
import CustomEdge from './custom-edge'
import CanvasMinimap from './canvas-minimap'
import CanvasContextMenu from './canvas-context-menu'
import WireStateMenu from './wire-state-menu'
import RecommendationModal from '../recommendations/recommendation-modal'

const nodeTypes: NodeTypes = {
  attackNode: AttackNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

export default function Canvas(): React.ReactNode {
  const { nodes, edges, updateNodes, updateEdges, onConnect, onNodeDrop } = useNode()
  const { setNodes, setEdges } = useSimulation()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState<{ x: number; y: number; nodeId?: string } | null>(null)
  const [wireMenu, setWireMenu] = useState<{ x: number; y: number; edgeId: string } | null>(null)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  
  // Update simulation context with current nodes and edges
  useEffect(() => {
    setNodes(nodes)
    setEdges(edges)
  }, [nodes, edges, setNodes, setEdges])
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return
      
      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      }
      
      // Check if it's a template drop
      const templateData = event.dataTransfer.getData('application/reactflow-template')
      if (templateData) {
        const template = JSON.parse(templateData)
        const offsetNodes = template.nodes.map((node: Node) => ({
          ...node,
          id: `${node.id}-${Date.now()}`,
          position: {
            x: node.position.x + position.x,
            y: node.position.y + position.y,
          },
        }))
        
        const offsetEdges = template.edges.map((edge: Edge) => ({
          ...edge,
          id: `${edge.id}-${Date.now()}`,
          source: `${edge.source}-${Date.now()}`,
          target: `${edge.target}-${Date.now()}`,
        }))
        
        updateNodes((nds) => [...nds, ...offsetNodes])
        updateEdges((eds) => [...eds, ...offsetEdges])
        return
      }
      
      // Handle single node drop
      onNodeDrop(event, position)
    },
    [onNodeDrop, updateNodes, updateEdges]
  )
  
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      updateNodes((nodes) => applyNodeChanges(changes, nodes))
    },
    [updateNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      updateEdges((edges) => applyEdgeChanges(changes, edges))
    },
    [updateEdges]
  )
  
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault()
      setMenu({ x: event.clientX, y: event.clientY, nodeId: node.id })
      setWireMenu(null)
    },
    []
  )
  
  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      setMenu({ x: event.clientX, y: event.clientY })
      setWireMenu(null)
    },
    []
  )
  
  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault()
      updateEdges((eds) => eds.filter((e) => e.id !== edge.id))
      setWireMenu(null)
    },
    [updateEdges]
  )
  
  const onEdgeDoubleClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault()
      event.stopPropagation()
      setWireMenu({ x: event.clientX, y: event.clientY, edgeId: edge.id })
      setMenu(null)
    },
    []
  )
  
  const closeMenu = useCallback(() => {
    setMenu(null)
    setWireMenu(null)
  }, [])
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setShowRecommendations(true)
  }, [])
  
  return (
    <motion.div 
      className="w-full BG h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeContextMenu={onNodeContextMenu}
          onPaneContextMenu={onPaneContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onClick={closeMenu}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'custom' }}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          className="matrix-grid"
        >
          {/* Main grid background */}
          <Background 
            variant={BackgroundVariant.Lines} 
            gap={40} 
            size={1} 
            color="rgba(0, 255, 65, 0.1)"
            className="!bg-[#0a0a0a]"
          />
          
          {/* Secondary grid for better visual reference */}
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="rgba(0, 255, 65, 0.05)"
            className="!bg-transparent"
          />
          
          <Controls 
            className="bg-card border border-border shadow-lg" 
            showInteractive={true}
          />
          <Panel position="bottom-right" className="mr-1 mb-1">
            <CanvasMinimap />
          </Panel>
        </ReactFlow>
        
        {menu && (
          <CanvasContextMenu 
            position={menu} 
            onClose={closeMenu}
            nodeId={menu.nodeId}
          />
        )}
        
        {wireMenu && (
          <WireStateMenu 
            position={wireMenu} 
            edgeId={wireMenu.edgeId}
            onClose={closeMenu}
          />
        )}
        
        {showRecommendations && selectedNode && (
          <RecommendationModal 
            node={selectedNode} 
            open={showRecommendations} 
            onClose={() => setShowRecommendations(false)} 
          />
        )}
      </div>
    </motion.div>
  )
}