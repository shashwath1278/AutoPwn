"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface GlitchTextProps {
  text: string
  className?: string
}

const GlitchText = ({ text, className = '' }: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState(text)

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  useEffect(() => {
    if (isGlitching) {
      const glitchChars = '!<>-_\\/[]{}—=+*^?#_'
      const glitchText = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' '
          return Math.random() > 0.7
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : char
        })
        .join('')
      setGlitchText(glitchText)
    } else {
      setGlitchText(text)
    }
  }, [isGlitching, text])

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        textShadow: isGlitching
          ? [
              '2px 0 #ff3b00, -2px 0 #00ff00',
              '-2px 0 #ff3b00, 2px 0 #00ff00',
              '2px 0 #ff3b00, -2px 0 #00ff00',
              'none',
            ]
          : 'none',
      }}
      transition={{
        duration: 0.2,
        repeat: isGlitching ? 3 : 0,
        repeatType: 'reverse',
      }}
    >
      <span className="text-orange-500">{glitchText}</span>
      {isGlitching && (
        <>
          <motion.span
            className="absolute top-0 left-0 text-orange-500/30"
            animate={{
              x: [0, 2, -2, 0],
              opacity: [0.5, 0.8, 0.5, 0],
            }}
            transition={{ duration: 0.2, repeat: 3 }}
          >
            {glitchText}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 text-orange-500/30"
            animate={{
              x: [0, -2, 2, 0],
              opacity: [0.5, 0.8, 0.5, 0],
            }}
            transition={{ duration: 0.2, repeat: 3 }}
          >
            {glitchText}
          </motion.span>
        </>
      )}
    </motion.div>
  )
}

export default GlitchText 