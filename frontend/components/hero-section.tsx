"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Terminal, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ParticleNetwork } from "@/components/particle-network"

interface HeroSectionProps {
  mode: "pentest" | "ctf";
}

export function HeroSection({ mode }: HeroSectionProps) {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      const text = mode === "pentest" ? "nmap -sV -sC -oA scan target.com" : "nc -lvnp 4444"

      let i = 0
      const typeWriter = () => {
        if (i < text.length && terminalRef.current) {
          terminalRef.current.innerHTML += text.charAt(i)
          i++
          setTimeout(typeWriter, 50)
        }
      }

      terminalRef.current.innerHTML = ""
      typeWriter()
    }
  }, [mode])

  // Define gradient colors based on mode
  const titleGradient = mode === "pentest" 
    ? "bg-gradient-to-r from-cyan-300 via-cyan-200 to-white" 
    : "bg-gradient-to-r from-orange-300 via-yellow-200 to-white";
  
  const accentGradient = mode === "pentest"
    ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500"
    : "bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500";
    
  const subtitleColor = mode === "pentest" ? "text-cyan-400" : "text-orange-400";
  
  const highlightBg = mode === "pentest" ? "bg-cyan-950/30" : "bg-orange-950/30";

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleNetwork mode={mode} />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-2 inline-block px-3 py-1 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/40 text-xs font-medium"
            >
              {mode === "pentest" ? "Penetration Testing Mode" : "Capture The Flag Mode"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-clip-text text-transparent ${accentGradient}`}
            >
              AutoPwn AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className={`text-base md:text-lg ${subtitleColor} mb-6 max-w-lg`}
            >
              {mode === "pentest"
                ? "Advanced penetration testing platform powered by AI. Automate reconnaissance, vulnerability scanning, and exploitation."
                : "Next-generation CTF platform with AI-assisted challenges. Sharpen your skills and compete in real-world scenarios."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-glow-cyan"
              >
                {mode === "pentest" ? "Start Scanning" : "Join Challenge"}
              </Button>
              <Button size="lg" variant="outline" className={`border-cyan-500/50 ${highlightBg}`}>
                {mode === "pentest" ? "View Documentation" : "Leaderboard"}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="relative"
          >
            <div className="rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 shadow-xl overflow-hidden">
              <div className="bg-background/80 p-2 flex items-center gap-2 border-b border-border/40">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground">
                  {mode === "pentest" ? "Terminal" : "CTF Console"}
                </div>
                {mode === "pentest" ? (
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Flag className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="bg-black/80 p-4 h-64 font-mono text-sm">
                <div className="text-green-400 mb-2">
                  {mode === "pentest" ? "root@autopwn:~#" : "player@ctf:~#"}{" "}
                  <span ref={terminalRef} className="text-cyan-400"></span>
                </div>

                {mode === "pentest" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="text-muted-foreground"
                  >
                    <p className="mb-1">Starting Nmap 7.94 scan at 2023-05-14 12:34</p>
                    <p className="mb-1">Scanning target.com (192.168.1.1) [1000 ports]</p>
                    <p className="mb-1 text-cyan-400">Discovered open port 22/tcp on 192.168.1.1</p>
                    <p className="mb-1 text-cyan-400">Discovered open port 80/tcp on 192.168.1.1</p>
                    <p className="mb-1 text-cyan-400">Discovered open port 443/tcp on 192.168.1.1</p>
                    <p className="mb-1 text-red-400">Possible vulnerability: CVE-2023-1234 (Apache 2.4.49)</p>
                  </motion.div>
                )}

                {mode === "ctf" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="text-muted-foreground"
                  >
                    <p className="mb-1">Listening on 0.0.0.0:4444</p>
                    <p className="mb-1 text-cyan-400">Connection received from 192.168.1.100:56789</p>
                    <p className="mb-1">$ whoami</p>
                    <p className="mb-1">www-data</p>
                    <p className="mb-1">$ ls -la</p>
                    <p className="mb-1">total 16</p>
                    <p className="mb-1">drwxr-xr-x 2 root root 4096 May 14 12:34 .</p>
                    <p className="mb-1">drwxr-xr-x 4 root root 4096 May 14 12:34 ..</p>
                    <p className="mb-1 text-purple-400">-rw-r--r-- 1 root root 220 May 14 12:34 flag.txt</p>
                  </motion.div>
                )}
              </div>
            </div>

            <motion.div
              className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
