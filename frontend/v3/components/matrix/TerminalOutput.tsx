"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TerminalOutputItem } from '@/types/terminal'
import GlitchText from './GlitchText'
import { cn } from '@/lib/utils'

interface TerminalOutputProps {
  output: TerminalOutputItem[]
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ output }) => {
  return (
    <div className="font-mono text-white space-y-2">
      <AnimatePresence initial={false}>
        {output.map((item, index) => (
          <motion.div 
            key={`${index}-${item.timestamp}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="whitespace-pre-wrap leading-6 text-center"
          >
            {item.type === 'command' && (
              <div className="flex items-center justify-center bg-black/10 px-4 py-2 rounded-md">
                <span className="mr-3 text-orange-500 font-bold">❯</span>
                <span className="text-white/90">{item.content}</span>
              </div>
            )}
            
            {item.type === 'response' && (
              <div className={cn(
                "px-4 py-2 transition-colors duration-200",
                item.style === 'error' ? 'text-red-400' : 'text-white/90'
              )}>
                {item.content}
              </div>
            )}
            
            {item.type === 'glitch' && (
              <div className="px-4 py-2 text-orange-400">
                <GlitchText text={item.content} />
              </div>
            )}
            
            {item.type === 'ascii' && (
              <pre className="text-orange-300/90 text-xs sm:text-sm overflow-x-auto p-4 bg-black/10 rounded-md inline-block mx-auto">
                {item.content}
              </pre>
            )}
            
            {item.type === 'loading' && (
              <div className="px-4 py-2 text-white/90 flex items-center justify-center">
                <span className="mr-2">{item.content}</span>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-orange-400"
                >
                  ...
                </motion.span>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TerminalOutput