"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface TerminalOutputProps {
  lines: string[]
}

const TerminalOutput = ({ lines }: TerminalOutputProps) => {
  return (
    <div className="space-y-2">
      {lines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-orange-500/80"
        >
          {line}
        </motion.div>
      ))}
    </div>
  )
}

export default TerminalOutput 