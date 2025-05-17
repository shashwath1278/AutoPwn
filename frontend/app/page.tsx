"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Award, Bot, Flag, Puzzle, Shield, Terminal } from "lucide-react" // Removed FlowChart

import { HeroSection } from "@/components/hero-section"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { FeatureSection } from "@/components/feature-section"
import { TerminalDemo } from "@/components/terminal-demo"
import { Footer } from "@/components/footer"

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<"pentest" | "ctf">("pentest")
  const [aiAgentMinimized, setAiAgentMinimized] = useState(true)

  // Gradient and color variations based on mode
  const textGradient = mode === "pentest"
    ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500"
    : "bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500";

  const buttonGradient = mode === "pentest"
    ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
    : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700";

  const shadowEffect = mode === "pentest" ? "shadow-glow-cyan" : "shadow-glow-orange";
  
  const borderColor = mode === "pentest" ? "border-cyan-500/20" : "border-orange-500/20";
  
  const bgPattern = mode === "pentest" 
    ? "bg-gradient-to-br from-background via-background to-background/90"
    : "bg-gradient-to-br from-background via-background/95 to-amber-950/10";

  return (
    <div className={`flex min-h-screen flex-col ${bgPattern} overflow-hidden transition-colors duration-500`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-noise-pattern opacity-[0.015] pointer-events-none mix-blend-soft-light" />

      <NavBar mode={mode} setMode={setMode} />

      {/* Rest of the component remains unchanged */}
      <main className="flex-1">
        <div className="container relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <HeroSection mode={mode} />
            </motion.div>
          </AnimatePresence>

          <FeatureSection />

          <section className="py-20">
            <div className="container">
              <h2 className={`text-3xl font-bold mb-8 text-center bg-clip-text text-transparent ${textGradient}`}>
                {mode === "pentest" ? "Terminal Experience" : "Challenge Arena"}
              </h2>
              <div className={`rounded-lg border ${borderColor} backdrop-blur-sm bg-card/30 shadow-xl overflow-hidden`}>
                <TerminalDemo />
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container text-center">
              <h2 className={`text-3xl font-bold mb-4 bg-clip-text text-transparent ${textGradient}`}>
                Ready to start {mode === "pentest" ? "hacking?" : "competing?"}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                {mode === "pentest" 
                  ? "Join the next generation of penetration testing with AutoPwn AI."
                  : "Test your skills in competitive CTF challenges powered by AI."}
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className={`${buttonGradient} text-white ${shadowEffect}`}
                  onClick={() => router.push("/dashboard")}
                >
                  Launch {mode === "pentest" ? "Dashboard" : "Arena"}
                </Button>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
