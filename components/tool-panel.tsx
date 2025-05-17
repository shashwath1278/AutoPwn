"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Zap, Shield, Terminal, Database, FileText, Code, Lock, Key } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ToolPanelProps {
  mode: "pentest" | "ctf"
}

export function ToolPanel({ mode }: ToolPanelProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const pentestTools = [
    { id: "nmap", name: "Nmap", icon: Search, description: "Network scanner" },
    { id: "metasploit", name: "Metasploit", icon: Zap, description: "Exploitation framework" },
    { id: "burp", name: "Burp Suite", icon: Shield, description: "Web vulnerability scanner" },
    { id: "sqlmap", name: "SQLMap", icon: Database, description: "SQL injection tool" },
    { id: "hydra", name: "Hydra", icon: Lock, description: "Password cracker" },
    { id: "wireshark", name: "Wireshark", icon: Search, description: "Network analyzer" },
  ]

  const ctfTools = [
    { id: "webtools", name: "Web Tools", icon: Code, description: "XSS, SQLi, etc." },
    { id: "crypto", name: "Crypto Tools", icon: Key, description: "Encryption/decryption" },
    { id: "forensics", name: "Forensics", icon: Search, description: "File analysis" },
    { id: "reverse", name: "Reverse Engineering", icon: Code, description: "Binary analysis" },
    { id: "stego", name: "Steganography", icon: FileText, description: "Hidden data" },
    { id: "pwn", name: "Pwn Tools", icon: Zap, description: "Exploitation" },
  ]

  const tools = mode === "pentest" ? pentestTools : ctfTools

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${
                selectedTool === tool.id
                  ? "bg-secondary text-foreground"
                  : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  selectedTool === tool.id ? "bg-background/50" : "bg-background/30"
                }`}
              >
                <tool.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-sm">{tool.name}</div>
                <div className="text-xs text-muted-foreground">{tool.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t border-border/40">
        <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-glow-cyan">
          <Terminal className="h-4 w-4 mr-2" />
          Launch Terminal
        </Button>
      </div>
    </div>
  )
}
