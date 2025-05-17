"use client"

import { motion } from "framer-motion"
import { Shield, Terminal, Zap, Brain, Lock, Server } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: Shield,
      title: "Advanced Scanning",
      description: "Automated vulnerability scanning with AI-powered analysis and prioritization.",
      color: "cyan",
    },
    {
      icon: Terminal,
      title: "Terminal Integration",
      description: "Seamless terminal access with command suggestions and real-time output.",
      color: "purple",
    },
    {
      icon: Zap,
      title: "Exploit Automation",
      description: "Automate exploitation with customizable payloads and attack vectors.",
      color: "red",
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get real-time guidance and recommendations from the built-in AI assistant.",
      color: "cyan",
    },
    {
      icon: Lock,
      title: "CTF Challenges",
      description: "Practice with realistic CTF challenges that adapt to your skill level.",
      color: "purple",
    },
    {
      icon: Server,
      title: "Attack Visualization",
      description: "Visualize attack paths and network topology with interactive graphs.",
      color: "red",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500">
            Key Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AutoPwn AI combines cutting-edge technology with intuitive design to provide a comprehensive penetration
            testing and CTF platform.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 bg-${feature.color}-500/10`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
