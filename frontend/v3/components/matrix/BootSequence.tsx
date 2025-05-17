"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BootSequenceProps {
  percentage: number
  onBootComplete: () => void
}

const BootSequence: React.FC<BootSequenceProps> = ({ percentage, onBootComplete }) => {
  const [bootMessages, setBootMessages] = useState<string[]>([])
  
  const allBootMessages = [
    "Initializing quantum processors...",
    "Loading neural interface protocols...",
    "Calibrating holographic displays...",
    "Synchronizing temporal matrices...",
    "Establishing quantum entanglement...",
    "Loading cybernetic enhancements...",
    "Initializing neural networks...",
    "Configuring bio-digital interfaces...",
    "Scanning dimensional barriers...",
    "Activating plasma conduits...",
    "Engaging fusion reactors...",
    "System ready for neural sync..."
  ]
  
  useEffect(() => {
    const thresholds = [5, 15, 25, 35, 45, 55, 65, 75, 85, 90, 95, 100]
    const currentIndex = thresholds.findIndex(threshold => percentage <= threshold)
    
    if (currentIndex !== -1) {
      const messagesCount = currentIndex === 0 ? 1 : currentIndex
      const currentMessages = allBootMessages.slice(0, messagesCount)
      setBootMessages(currentMessages)
    } else if (percentage >= 100) {
      setBootMessages(allBootMessages)
      setTimeout(onBootComplete, 500)
    }
  }, [percentage, onBootComplete])

  return (
    <motion.div 
      className="w-full max-w-lg p-8 text-white font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <h2 className="text-xl font-bold mb-4 text-orange-400">System Initialization</h2>
        
        <div className="space-y-1">
          {bootMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "text-sm bg-black/20 p-2 rounded transition-colors duration-200",
                index === bootMessages.length - 1 && "border-l-2 border-orange-500"
              )}
            >
              {message}
              {index === bootMessages.length - 1 && (
                <motion.span 
                  className="inline-block w-2 h-4 ml-1 bg-orange-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-orange-900/50">
          <div className="relative h-2 w-full bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="absolute left-0 top-0 h-full bg-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: "0 0 10px rgba(255, 123, 36, 0.5)"
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Initialization progress:</span>
            <span>{percentage}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BootSequence