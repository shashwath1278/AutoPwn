"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function TerminalDemo() {
  const [currentLine, setCurrentLine] = useState(0)
  const [typing, setTyping] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  const commands = [
    { cmd: "autopwn scan --target example.com", delay: 1000 },
    { cmd: "Starting scan on example.com...", isOutput: true },
    { cmd: "Discovered open ports: 22, 80, 443", isOutput: true },
    { cmd: "Identified services: SSH, HTTP, HTTPS", isOutput: true },
    { cmd: "Detected vulnerabilities:", isOutput: true },
    { cmd: "  - CVE-2023-1234 (Critical) - Apache 2.4.49", isOutput: true, highlight: "red" },
    { cmd: "  - CVE-2023-5678 (Medium) - OpenSSH 7.9", isOutput: true, highlight: "yellow" },
    { cmd: "autopwn exploit --vuln CVE-2023-1234 --target example.com", delay: 1500 },
    { cmd: "Generating exploit payload...", isOutput: true },
    { cmd: "Payload generated successfully", isOutput: true },
    { cmd: "Launching exploit...", isOutput: true },
    { cmd: "Exploit successful! Got shell access", isOutput: true, highlight: "green" },
    { cmd: "autopwn shell", delay: 1000 },
    { cmd: "Connected to shell on example.com", isOutput: true },
    { cmd: "root@example:~# whoami", delay: 800 },
    { cmd: "root", isOutput: true, highlight: "cyan" },
    { cmd: "root@example:~# ls -la", delay: 800 },
    { cmd: "total 32", isOutput: true },
    { cmd: "drwxr-xr-x 4 root root 4096 May 14 12:34 .", isOutput: true },
    { cmd: "drwxr-xr-x 4 root root 4096 May 14 12:34 ..", isOutput: true },
    { cmd: "-rw------- 1 root root  420 May 14 12:34 .bash_history", isOutput: true },
    { cmd: "-rw-r--r-- 1 root root 3106 May 14 12:34 .bashrc", isOutput: true },
    { cmd: "-rw-r--r-- 1 root root  161 May 14 12:34 .profile", isOutput: true },
    { cmd: "-rw-r--r-- 1 root root  220 May 14 12:34 .bash_logout", isOutput: true },
    { cmd: "-rw-r--r-- 1 root root  512 May 14 12:34 flag.txt", isOutput: true, highlight: "purple" },
  ]

  useEffect(() => {
    if (currentLine >= commands.length) return

    const command = commands[currentLine]

    if (command.isOutput) {
      // Output lines appear immediately
      setCurrentLine((prev) => prev + 1)
    } else {
      // Command lines are typed out
      setTyping(true)

      // After typing animation, wait for the specified delay
      setTimeout(() => {
        setTyping(false)
        setTimeout(() => {
          setCurrentLine((prev) => prev + 1)
        }, command.delay || 500)
      }, command.cmd.length * 50)
    }

    // Scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [currentLine])

  return (
    <div className="bg-black p-4 rounded-lg font-mono text-sm">
      <div className="flex items-center gap-2 mb-4 text-muted-foreground text-xs">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
        </div>
        <span>AutoPwn Terminal</span>
      </div>

      <div ref={terminalRef} className="h-64 overflow-auto text-green-400 space-y-1">
        {commands.slice(0, currentLine).map((line, index) => (
          <div key={index} className="leading-relaxed">
            {line.isOutput ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={line.highlight ? `text-${line.highlight}-400` : "text-muted-foreground"}
              >
                {line.cmd}
              </motion.div>
            ) : (
              <div>
                <span className="text-purple-400">user@autopwn:~$</span>{" "}
                {index === currentLine - 1 && typing ? (
                  <span className="typing-animation">{line.cmd.substring(0, (line.cmd.length * 50) / 1000)}</span>
                ) : (
                  <span>{line.cmd}</span>
                )}
              </div>
            )}
          </div>
        ))}

        {currentLine < commands.length && !commands[currentLine].isOutput && (
          <div>
            <span className="text-purple-400">user@autopwn:~$</span>{" "}
            <span className="typing-animation">
              {commands[currentLine].cmd.substring(0, (commands[currentLine].cmd.length * 50) / 1000)}
            </span>
          </div>
        )}

        {currentLine >= commands.length && (
          <div>
            <span className="text-purple-400">user@autopwn:~$</span> <span className="animate-pulse">█</span>
          </div>
        )}
      </div>
    </div>
  )
}
