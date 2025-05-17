"use client"

import React from 'react'
import { motion } from 'framer-motion'
import GlitchText from './GlitchText'

interface BootSequenceProps {
  percentage: number
  onBootComplete?: () => void
}

const BootSequence = ({ percentage, onBootComplete }: BootSequenceProps) => {
  const messages = [
    'Initializing system...',
    'Loading core modules...',
    'Establishing secure connection...',
    'Verifying system integrity...',
    'Starting terminal interface...',
  ]

  const currentMessageIndex = Math.floor((percentage / 100) * messages.length)
  const currentMessage = messages[currentMessageIndex - 1] || ''

  return (
    <div className="w-full max-w-md p-8 space-y-8">
      {/* Logo */}
      <div className="text-center">
        <GlitchText text="MATRIX" className="text-4xl font-bold" />
        <p className="text-orange-500/60 text-sm mt-2">Terminal System v1.0</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-1 bg-orange-500/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-orange-500/60 text-xs text-right">
          {percentage}%
        </p>
      </div>

      {/* Status message */}
      <motion.div
        key={currentMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-orange-500/80 text-center"
      >
        {currentMessage}
      </motion.div>

      {/* Decorative elements */}
      <div className="flex justify-center space-x-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-500/40"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default BootSequence 