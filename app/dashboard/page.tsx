"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Terminal, Flag, Activity, Network, ChevronRight } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { AttackFlowVisualizer } from "@/components/attack-flow-visualizer"
import { TerminalWindow } from "@/components/terminal-window"
import { DashboardCharts } from "@/components/dashboard-charts"
import { ToolPanel } from "@/components/tool-panel"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [mode, setMode] = useState<"pentest" | "ctf">("pentest")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
  }

  return (
    <DashboardLayout mode={mode} setMode={setMode}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500">
            {mode === "pentest" ? "Penetration Testing Dashboard" : "Capture The Flag Arena"}
          </h1>
          <Button variant="outline" size="sm" className="gap-2">
            <Network className="h-4 w-4" />
            <span>Connected</span>
          </Button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={item}>
            <DashboardCard
              title="Attack Surface"
              icon={<Shield className="h-5 w-5 text-cyan-400" />}
              onClick={() => setActivePanel("attack-surface")}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Open Ports</span>
                  <span className="text-sm font-mono">12/65535</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Vulnerabilities</span>
                  <span className="text-sm font-mono text-red-400">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Services</span>
                  <span className="text-sm font-mono">5</span>
                </div>
              </div>
            </DashboardCard>
          </motion.div>

          <motion.div variants={item}>
            <DashboardCard
              title="Terminal"
              icon={<Terminal className="h-5 w-5 text-purple-400" />}
              onClick={() => setActivePanel("terminal")}
            >
              <div className="h-32 overflow-hidden rounded bg-black/50 p-2">
                <TerminalWindow minimal />
              </div>
              <div className="mt-2 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <span>Open Terminal</span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </DashboardCard>
          </motion.div>

          <motion.div variants={item}>
            <DashboardCard
              title={mode === "pentest" ? "Active Scans" : "Challenges"}
              icon={
                mode === "pentest" ? (
                  <Activity className="h-5 w-5 text-green-400" />
                ) : (
                  <Flag className="h-5 w-5 text-red-400" />
                )
              }
              onClick={() => setActivePanel(mode === "pentest" ? "scans" : "challenges")}
            >
              {mode === "pentest" ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nmap Scan</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Vulnerability Scan</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">Queued</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Web Exploitation</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">2/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reverse Engineering</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">1/3</span>
                  </div>
                </div>
              )}
            </DashboardCard>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 shadow-lg p-4"
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <h2 className="text-lg font-medium mb-4">
            {mode === "pentest" ? "Attack Flow Visualizer" : "CTF Progress Map"}
          </h2>
          <div className="h-[400px]">
            <AttackFlowVisualizer mode={mode} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: 0.8 }}
          className="rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 shadow-lg p-4"
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <h2 className="text-lg font-medium mb-4">Tools</h2>
          <ToolPanel mode={mode} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 1 }}
          className="rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 shadow-lg p-4"
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
        >
          <h2 className="text-lg font-medium mb-4">Analytics</h2>
          <DashboardCharts mode={mode} />
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
