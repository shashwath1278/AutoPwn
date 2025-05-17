"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import TerminalInput from './TerminalInput'
import TerminalOutput from './TerminalOutput'
import MatrixRain from './MatrixRain'
import GlitchText from './GlitchText'

const Terminal = () => {
  const [output, setOutput] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const outputEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [output])

  const handleCommand = async (command: string) => {
    setIsProcessing(true)
    setOutput(prev => [...prev, `> ${command}`])

    // Simulate command processing
    await new Promise(resolve => setTimeout(resolve, 500))

    // Add command output
    setOutput(prev => [...prev, 'Command executed successfully'])
    setIsProcessing(false)
  }

  return (
    <div className="relative w-full h-full font-mono text-sm">
      {/* Matrix rain effect */}
      <MatrixRain />
      
      {/* Terminal content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-orange-500/20">
          <GlitchText text="MATRIX TERMINAL v1.0" />
        </div>
        
        {/* Output area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {output.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-white"
            >
              {line}
            </motion.div>
          ))}
          <div ref={outputEndRef} />
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t border-orange-500/20">
          <TerminalInput 
            onCommand={handleCommand}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  )
}

export default Terminal