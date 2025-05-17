"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Terminal from './Terminal'
import BootSequence from './BootSequence'

const MatrixTerminal = () => {
  const [isBooting, setIsBooting] = useState(true)
  const [bootingPercentage, setBootingPercentage] = useState(0)
  
  useEffect(() => {
    const bootTime = 4000
    const interval = 50
    const steps = bootTime / interval
    let currentStep = 0

    const bootTimer = setInterval(() => {
      currentStep++
      const newPercentage = Math.min(100, Math.floor((currentStep / steps) * 100))
      setBootingPercentage(newPercentage)
      
      if (newPercentage >= 100) {
        clearInterval(bootTimer)
        setTimeout(() => setIsBooting(false), 1000)
      }
    }, interval)

    return () => clearInterval(bootTimer)
  }, [])

  return (
    <div className="relative w-full h-[90vh] rounded-lg overflow-hidden border border-orange-500/20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-orange-950/5 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,123,36,0.05)_0%,transparent_100%)]" />
      
      {/* Terminal content */}
      <AnimatePresence mode="wait">
        {isBooting ? (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/90"
          >
            <BootSequence 
              percentage={bootingPercentage}
              onBootComplete={() => setIsBooting(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="terminal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20"
          >
            <Terminal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MatrixTerminal