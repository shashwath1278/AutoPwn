"use client"

import { useState, useCallback, useRef } from 'react'
import { TerminalOutputItem } from '@/types/terminal'
import { processCommand, getCommandSuggestions } from '@/lib/commandProcessor'

export function useCommandProcessor() {
  const [commandOutput, setCommandOutput] = useState<TerminalOutputItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)

  const clearOutput = useCallback(() => {
    setCommandOutput([])
    setSuggestions([])
  }, [])

  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsProcessing(false)
    }
  }, [])

  const handleCommand = useCallback(async (command: string) => {
    const commandItem: TerminalOutputItem = {
      type: 'command',
      content: command,
      timestamp: Date.now()
    }
    
    setCommandOutput(prev => [...prev, commandItem])
    setIsProcessing(true)
    setSuggestions([])

    if (command.toLowerCase() === 'clear') {
      clearOutput()
      setIsProcessing(false)
      return
    }

    abortControllerRef.current = new AbortController()

    try {
      const response = await processCommand(command, abortControllerRef.current.signal)
      
      response.forEach(item => {
        setCommandOutput(prev => [...prev, {
          ...item,
          timestamp: Date.now()
        }])
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setCommandOutput(prev => [...prev, {
          type: 'response',
          content: 'Command execution cancelled.',
          style: 'warning',
          timestamp: Date.now()
        }])
      } else {
        setCommandOutput(prev => [...prev, {
          type: 'response',
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          style: 'error',
          timestamp: Date.now()
        }])
      }
    } finally {
      setIsProcessing(false)
      abortControllerRef.current = null
    }
  }, [clearOutput])

  const getSuggestions = useCallback((input: string) => {
    const matches = getCommandSuggestions(input)
    setSuggestions(matches)
  }, [])

  return {
    commandOutput,
    processCommand: handleCommand,
    clearOutput,
    cancelProcessing,
    isProcessing,
    suggestions,
    getSuggestions
  }
}