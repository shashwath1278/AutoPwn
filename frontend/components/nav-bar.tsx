"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, Shield, Flag, Terminal, Database, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

interface NavBarProps {
  mode: "pentest" | "ctf";
  setMode: (mode: "pentest" | "ctf") => void;
}

export function NavBar({ mode, setMode }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Gradient colors based on mode
  const logoGradient = mode === "pentest" 
    ? "bg-gradient-to-br from-cyan-500 via-purple-500 to-red-500" 
    : "bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500";
  
  const textGradient = mode === "pentest"
    ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500"
    : "bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500";

  const buttonBorder = mode === "pentest" 
    ? "border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30" 
    : "border-orange-500/30 text-orange-400 hover:bg-orange-950/30";
  
  const gradientButton = mode === "pentest"
    ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
    : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700";

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Shield },
    { name: "Attack flow builder", href: "/attack-builder", icon: Flag },
    { name: "Pen Test", href: "/pen-testing", icon: Terminal },
    { name: "Tools", href: "/tools", icon: Database },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-sm bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className={`w-8 h-8 rounded-md ${logoGradient}`}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            />
            <span className={`font-bold text-xl bg-clip-text text-transparent ${textGradient}`}>
              AutoPwn AI
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="mr-2">
            <ModeToggle mode={mode} setMode={setMode} />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className={`hidden md:flex gap-2 ${buttonBorder}`}
          >
            <User className="h-4 w-4" />
            Sign In
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 backdrop-blur-md border-border/40">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className={`w-8 h-8 rounded-md ${logoGradient}`} />
                  <span className={`font-bold text-xl bg-clip-text text-transparent ${textGradient}`}>
                    AutoPwn AI
                  </span>
                </Link>

                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground p-2 rounded-md hover:bg-secondary/50"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
                  
                <Button
                  className={`mt-4 ${gradientButton} text-white shadow-glow-cyan`}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
