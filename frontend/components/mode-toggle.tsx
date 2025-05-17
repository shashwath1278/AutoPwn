"use client"

import { motion } from "framer-motion"
import { Shield, Flag } from "lucide-react"

interface ModeToggleProps {
  mode: "pentest" | "ctf"
  setMode: (mode: "pentest" | "ctf") => void
}

export function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="flex items-center justify-center p-1 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/40 relative overflow-hidden">
      {/* Glow effect container */}
      <motion.div
        className="absolute inset-0 z-0 opacity-70 blur-md"
        animate={{
          background:
            mode === "pentest"
              ? "radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, rgba(0, 0, 0, 0) 70%)"
              : "radial-gradient(circle, rgba(255, 0, 100, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-10 flex">
        <button
          className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-colors ${
            mode === "pentest" ? "text-background" : "text-muted-foreground"
          }`}
          onClick={() => setMode("pentest")}
        >
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">PenTest</span>
        </button>

        <button
          className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-colors ${
            mode === "ctf" ? "text-background" : "text-muted-foreground"
          }`}
          onClick={() => setMode("ctf")}
        >
          <Flag className="h-4 w-4" />
          <span className="text-sm font-medium">CTF</span>
        </button>

        <motion.div
          className="absolute inset-0 rounded-full"
          initial={false}
          animate={{
            x: mode === "pentest" ? 0 : "100%",
            width: "50%",
            backgroundColor: mode === "pentest" ? "rgb(0, 255, 255)" : "rgb(255, 0, 100)",
            boxShadow:
              mode === "pentest" ? "0 0 15px 2px rgba(0, 255, 255, 0.7)" : "0 0 15px 2px rgba(255, 0, 100, 0.7)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            boxShadow: { duration: 0.5 },
          }}
        />

        {/* Animated particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5],
              x: [
                mode === "pentest" ? "25%" : "75%",
                mode === "pentest" ? `${25 + (Math.random() * 20) - 10}%` : `${75 + (Math.random() * 20) - 10}%`,
              ],
              y: ["50%", `${Math.random() * 100}%`],
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}
