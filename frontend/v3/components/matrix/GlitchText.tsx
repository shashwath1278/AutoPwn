"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface GlitchTextProps {
  text: string
  intensity?: 'low' | 'medium' | 'high'
  duration?: number
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  intensity = 'medium',
  duration = 2.5 
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(true)
  
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

  const glitchRates = {
    low: { interval: 100, chance: 0.03, maxGlitchChars: 2 },
    medium: { interval: 80, chance: 0.06, maxGlitchChars: 4 },
    high: { interval: 50, chance: 0.1, maxGlitchChars: 6 }
  }
  
  useEffect(() => {
    if (!isGlitching) return
    
    const { interval, chance, maxGlitchChars } = glitchRates[intensity]
    
    const glitchInterval = setInterval(() => {
      let newText = text.split('')
      
      const glitchCount = Math.floor(Math.random() * maxGlitchChars) + 1
      
      for (let i = 0; i < glitchCount; i++) {
        if (Math.random() < chance) {
          const index = Math.floor(Math.random() * text.length)
          const randomChar = characters.charAt(Math.floor(Math.random() * characters.length))
          newText[index] = randomChar
        }
      }
      
      setDisplayText(newText.join(''))
    }, interval)
    
    const stopGlitchTimeout = setTimeout(() => {
      setIsGlitching(false)
      setDisplayText(text)
    }, duration * 1000)
    
    return () => {
      clearInterval(glitchInterval)
      clearTimeout(stopGlitchTimeout)
    }
  }, [text, intensity, duration, isGlitching])
  
  return (
    <motion.span
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className="inline-block text-orange-400 font-bold relative"
      style={{
        textShadow: '0 0 8px rgba(255, 123, 36, 0.5)'
      }}
    >
      {displayText}
    </motion.span>
  )
}

export default GlitchText