"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TerminalInputProps {
  onCommand: (command: string) => void
  isProcessing: boolean
}

const TerminalInput = ({ onCommand, isProcessing }: TerminalInputProps) => {
  const [input, setInput] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isProcessing) return

    if (e.key === 'Enter' && input.trim()) {
      onCommand(input.trim())
      setInput('')
      setCursorPosition(0)
    } else if (e.key === 'ArrowLeft') {
      setCursorPosition(prev => Math.max(0, prev - 1))
    } else if (e.key === 'ArrowRight') {
      setCursorPosition(prev => Math.min(input.length, prev + 1))
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return
    setInput(e.target.value)
    setCursorPosition(e.target.selectionStart || 0)
  }

  return (
    <div className="relative flex items-center py-3">
      <span className="text-white mr-3 text-xl">$</span>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-white outline-none font-mono text-lg py-2"
          disabled={isProcessing}
          placeholder={isProcessing ? 'Processing...' : 'Enter command...'}
        />
        {!isProcessing && (
          <motion.div
            className="absolute top-0 bottom-0 w-[2px] bg-orange-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            style={{
              left: `${cursorPosition * 12}px`,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default TerminalInput