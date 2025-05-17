"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Flag, Terminal, Database, Settings, User, Menu } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardLayoutProps {
  children: React.ReactNode
  mode: "pentest" | "ctf"
  setMode: (mode: "pentest" | "ctf") => void
}

export function DashboardLayout({ children, mode, setMode }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Shield, active: true },
    { name: mode === "pentest" ? "Scans" : "Challenges", href: "/scans", icon: mode === "pentest" ? Database : Flag },
    { name: "Terminal", href: "/terminal", icon: Terminal },
    { name: "Tools", href: "/tools", icon: Database },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-background/90">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-noise-pattern opacity-[0.015] pointer-events-none mix-blend-soft-light" />

      {/* Sidebar - Desktop */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="hidden md:flex flex-col w-64 border-r border-border/40 backdrop-blur-sm bg-card/30"
      >
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500 via-purple-500 to-red-500" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500">
              AutoPwn AI
            </span>
          </div>
        </div>

        <div className="p-4">
          <ModeToggle mode={mode} setMode={setMode} />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                item.active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-border/40">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground">
            <User className="h-5 w-5" />
            <span>user@example.com</span>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500 via-purple-500 to-red-500" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500">
              AutoPwn AI
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle mode={mode} setMode={setMode} />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background/95 backdrop-blur-md border-border/40">
                <div className="flex flex-col gap-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500 via-purple-500 to-red-500" />
                    <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500">
                      AutoPwn AI
                    </span>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          item.active
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </a>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t border-border/40">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground">
                      <User className="h-5 w-5" />
                      <span>user@example.com</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-0 mt-16 md:mt-0">{children}</main>
    </div>
  )
}
