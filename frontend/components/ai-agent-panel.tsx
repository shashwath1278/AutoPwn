"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Paperclip, Zap, X, Maximize, Minimize, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AIAgentPanelProps {
  mode: "pentest" | "ctf"
  minimized?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  className?: string
}

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIAgentPanel({ mode, minimized = false, onMinimize, onMaximize, className = "" }: AIAgentPanelProps) {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: mode === "pentest" 
        ? "Hello, I'm your AutoPwn AI assistant. How can I help with your penetration testing today?" 
        : "Hello, I'm your CTF AI assistant. How can I help with your challenges today?",
      timestamp: new Date()
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue, mode)
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const getAIResponse = (input: string, mode: "pentest" | "ctf"): string => {
    // This would normally call an actual API - this is just for demo
    const pentestResponses = [
      "Based on your input, I recommend running a thorough Nmap scan first to identify open ports and services.",
      "I've analyzed the vulnerability profile. Consider targeting the HTTP service on port 80 for potential exploits.",
      "The information you provided suggests this might be vulnerable to SQL injection. Have you tried testing input validation?",
      "Looking at the scan results, I'd recommend focusing on the outdated SSH server which could be vulnerable to CVE-2022-1234.",
      "For this penetration test scenario, a good approach would be to start with reconnaissance before attempting any exploits.",
    ]
    
    const ctfResponses = [
      "This looks like a classic steganography challenge. Have you tried analyzing the image with tools like Stegsolve?",
      "Based on the cipher text pattern, this appears to be a Vigenère cipher. Try finding the key length first.",
      "This binary likely contains a buffer overflow vulnerability. I recommend examining the input handling functions.",
      "The web challenge seems to involve client-side validation. Consider looking at the JavaScript code for bypasses.",
      "For this type of reverse engineering challenge, start by identifying the check function that validates your input.",
    ]
    
    const responses = mode === "pentest" ? pentestResponses : ctfResponses
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Panel color variations based on mode
  const panelGradient = mode === "pentest"
    ? "from-cyan-950/50 to-purple-950/50"
    : "from-orange-950/50 to-red-950/50"
  
  const accentColor = mode === "pentest" ? "border-cyan-500/30" : "border-orange-500/30"
  const textHighlight = mode === "pentest" ? "text-cyan-400" : "text-orange-400"

  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-4 right-4 rounded-full ${className}`}
      >
        <Button
          size="icon"
          className={`w-12 h-12 rounded-full bg-gradient-to-r ${
            mode === "pentest" ? "from-cyan-600 to-purple-600" : "from-orange-600 to-red-600"
          } shadow-lg`}
          onClick={onMaximize}
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`flex flex-col bg-gradient-to-br ${panelGradient} rounded-lg border ${accentColor} shadow-xl backdrop-blur-md ${className}`}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bot className={`h-5 w-5 ${textHighlight}`} />
            <h3 className="font-medium">
              AutoPwn AI Assistant
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-secondary/50">
                {mode === "pentest" ? "PenTest Mode" : "CTF Mode"}
              </span>
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMinimize}>
              <Minimize className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-secondary-foreground"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className={`h-4 w-4 ${textHighlight}`} />
                    <span className={`text-xs font-medium ${textHighlight}`}>AutoPwn AI</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-70 text-right mt-1">
                  {new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(message.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Loader2 className={`h-4 w-4 ${textHighlight} animate-spin`} />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI for assistance..."
              className="min-h-[60px] resize-none bg-background/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                className={`bg-gradient-to-r ${
                  mode === "pentest" ? "from-cyan-600 to-purple-600" : "from-orange-600 to-red-600"
                } hover:opacity-90`}
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="bg-secondary/50"
              >
                <Zap className={`h-4 w-4 ${textHighlight}`} />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <Paperclip className="h-3 w-3 mr-1" />
                Attach
              </Button>
              {mode === "pentest" ? (
                <>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Scan</Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Exploit</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Hint</Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Submit</Button>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {mode === "pentest" ? "PenTest Agent" : "CTF Agent"} v1.0
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
