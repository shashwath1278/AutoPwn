"use client"

import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow'
import { useSimulation } from '../../context/simulation-context'
import { motion } from 'framer-motion'

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const { isPlaying, activeEdgeIds, getWireState } = useSimulation()
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const wireState = getWireState(id)
  const isActive = isPlaying && activeEdgeIds.includes(id)

  // Only use glow colors for active state
  const colors = isActive ? {
    primary: 'rgba(255, 153, 0, 0.9)', // Bright Orange
    secondary: 'rgba(255, 200, 0, 0.8)', // Bright Yellow
    shadow: 'rgba(255, 153, 0, 0.6)',
    blur: '12px'
  } : {
    primary: wireState === false ? 'rgba(255, 51, 51, 0.7)' : 'rgba(0, 255, 65, 0.5)',
    secondary: wireState === false ? 'rgba(255, 51, 51, 0.6)' : 'rgba(0, 255, 65, 0.4)',
    shadow: 'transparent',
    blur: '0px'
  }

  return (
    <>
      {/* Base path */}
      <path
        d={edgePath}
        className="react-flow__edge-path"
        style={{
          strokeWidth: 2,
          stroke: colors.secondary,
          opacity: 0.3,
        }}
      />
      
      {/* Main line */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected || isActive ? 3 : 2,
          stroke: colors.primary,
        }}
      />
      
      {/* Animated flow effect - only shown when active */}
      {isActive && (
        <>
          {/* Glow background */}
          <path
            d={edgePath}
            className="react-flow__edge-path"
            style={{
              strokeWidth: 10,
              stroke: colors.shadow,
              filter: `blur(${colors.blur})`,
              opacity: 0.7,
            }}
          />
          
          {/* Gradient flow effect */}
          <motion.path
            d={edgePath}
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{ 
              pathLength: 0.4,
              pathOffset: 1,
            }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Infinity,
              delay: 0,
              repeatDelay: 0
            }}
            style={{
              stroke: `url(#gradient-${id})`,
              strokeWidth: 8,
              fill: 'none',
              filter: 'url(#glow)',
            }}
          />

          {/* Multiple gradient flow effects for smoother animation */}
          {[...Array(3)].map((_, i) => (
            <motion.path
              key={`flow-${i}`}
              d={edgePath}
              initial={{ pathLength: 0.4, pathOffset: -0.4 * i }}
              animate={{ 
                pathLength: 0.4,
                pathOffset: 1,
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
                delay: (i * 0.67),
                repeatDelay: 0
              }}
              style={{
                stroke: `url(#gradient-${id})`,
                strokeWidth: 8,
                fill: 'none',
                filter: 'url(#glow)',
                opacity: 0.7
              }}
            />
          ))}

          {/* Trailing particles with glow */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={i}
              cx={0}
              cy={0}
              r={6 - (i * 0.5)}
              fill={colors.secondary}
              filter="url(#glow)"
              initial={{ offsetDistance: "0%" }}
              animate={{ 
                offsetDistance: "100%",
              }}
              transition={{ 
                duration: 2,
                ease: "linear",
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 0
              }}
              style={{
                offsetPath: `path("${edgePath}")`,
                opacity: 0.9 - (i * 0.1),
                filter: `blur(${parseInt(colors.blur) - 4}px)`,
              }}
            />
          ))}
        </>
      )}
      
      {/* Filters and gradients */}
      <defs>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feComposite in="SourceGraphic" in2="coloredBlur" operator="over"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <linearGradient id={`gradient-${id}`} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0"/>
          <stop offset="50%" stopColor={colors.primary} stopOpacity="1"/>
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0"/>
        </linearGradient>
      </defs>
    </>
  )
}