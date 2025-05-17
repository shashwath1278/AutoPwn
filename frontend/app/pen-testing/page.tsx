"use client"

import React from 'react'
import { motion } from 'framer-motion'
import MatrixTerminal from '../../v3/components/matrix/MatrixTerminal'

export default function PenTestingPage() {
  return (
    <motion.div 
      className="w-full h-screen bg-black p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MatrixTerminal />
    </motion.div>
  )
} 