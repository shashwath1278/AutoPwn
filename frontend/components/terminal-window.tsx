"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Maximize2, Minimize2, X } from "lucide-react"

interface TerminalWindowProps {
  minimal?: boolean
}

export function TerminalWindow({ minimal = false }: TerminalWindowProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [output, setOutput] = useState<Array<{ text: string; type?: string }>>([
    { text: "AutoPwn Terminal v1.0", type: "system" },
    { text: "Type 'help' to see available commands", type: "system" },
  ])
  const [isMaximized, setIsMaximized] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add command to history
    setHistory((prev) => [...prev, input])

    // Add command to output
    setOutput((prev) => [...prev, { text: input }])

    // Process command
    processCommand(input)

    // Clear input
    setInput("")
  }

  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase()

    if (command === "help") {
      setOutput((prev) => [
        ...prev,
        { text: "Available commands:", type: "system" },
        { text: "  help - Show this help message", type: "system" },
        { text: "  scan [target] - Scan a target", type: "system" },
        { text: "  exploit [vuln] [target] - Exploit a vulnerability", type: "system" },
        { text: "  clear - Clear the terminal", type: "system" },
      ])
    } else if (command.startsWith("scan")) {
      const target = command.split(" ")[1] || "localhost"
      setOutput((prev) => [
        ...prev,
        { text: `Scanning ${target}...`, type: "info" },
        { text: "Discovered open ports: 22, 80, 443", type: "success" },
        { text: "Identified services: SSH, HTTP, HTTPS", type: "success" },
        { text: "Detected vulnerabilities:", type: "warning" },
        { text: "  - CVE-2023-1234 (Critical) - Apache 2.4.49", type: "error" },
        { text: "  - CVE-2023-5678 (Medium) - OpenSSH 7.9", type: "warning" },
      ])
    } else if (command.startsWith("exploit")) {
      const args = command.split(" ")
      const vuln = args[1] || "CVE-2023-1234"
      const target = args[2] || "localhost"

      setOutput((prev) => [
        ...prev,
        { text: `Exploiting ${vuln} on ${target}...`, type: "info" },
        { text: "Generating exploit payload...", type: "info" },
      ])

      // Simulate async operation
      setTimeout(() => {
        setOutput((prev) => [
          ...prev,
          { text: "Payload generated successfully", type: "success" },
          { text: "Launching exploit...", type: "info" },
        ])

        setTimeout(() => {
          setOutput((prev) => [
            ...prev,
            { text: "Exploit successful! Got shell access", type: "success" },
            { text: "root@target:~# ", type: "prompt" },
          ])
        }, 1500)
      }, 1000)
    } else if (command === "clear") {
      setOutput([
        { text: "AutoPwn Terminal v1.0", type: "system" },
        { text: "Type 'help' to see available commands", type: "system" },
      ])
    } else {
      setOutput((prev) => [...prev, { text: `Command not found: ${command}`, type: "error" }])
    }
  }

  if (minimal) {
    return (
      <div className="font-mono text-xs text-green-400">
        <div>user@autopwn:~$ scan target.com</div>
        <div className="text-muted-foreground">Scanning target.com...</div>
        <div className="text-cyan-400">Discovered open ports: 22, 80, 443</div>
      </div>
    )
  }

  return (
    <motion.div
      className={`rounded-lg border border-border/40 backdrop-blur-sm bg-black/90 shadow-xl overflow-hidden ${
        isMaximized ? "fixed inset-4 z-50" : "w-full h-[500px]"
      }`}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="bg-background/80 p-2 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
          </div>
          <span className="text-muted-foreground text-xs">AutoPwn Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded-sm hover:bg-secondary/50 text-muted-foreground"
          >
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button className="p-1 rounded-sm hover:bg-secondary/50 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="h-full overflow-auto p-4 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {output.map((line, index) => (
          <div
            key={index}
            className={`mb-1 ${
              line.type === "system"
                ? "text-muted-foreground"
                : line.type === "info"
                  ? "text-cyan-400"
                  : line.type === "success"
                    ? "text-green-400"
                    : line.type === "warning"
                      ? "text-yellow-400"
                      : line.type === "error"
                        ? "text-red-400"
                        : line.type === "prompt"
                          ? "text-purple-400"
                          : "text-green-400"
            }`}
          >
            {line.type !== "prompt" && !output[index - 1]?.type?.includes("prompt") && (
              <span className="text-purple-400">user@autopwn:~$</span>
            )}{" "}
            {line.text}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-purple-400">user@autopwn:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-400 ml-2"
            autoFocus
          />
        </form>
      </div>
    </motion.div>
  )
}
