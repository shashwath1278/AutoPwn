"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface ParticleNetworkProps {
  mode: "pentest" | "ctf"
}

export function ParticleNetwork({ mode }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = Math.random() * 2 + 1

        // Set color based on mode
        if (mode === "pentest") {
          this.color = `rgba(0, ${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 155) + 100}, ${Math.random() * 0.5 + 0.2})`
        } else {
          this.color = `rgba(${Math.floor(Math.random() * 155) + 100}, 0, ${Math.floor(Math.random() * 155) + 100}, ${Math.random() * 0.5 + 0.2})`
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }

      update(width: number, height: number) {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx = -this.vx
        if (this.y < 0 || this.y > height) this.vy = -this.vy
      }
    }

    // Create particles
    const particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 150)
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height))
    }

    // Draw lines between particles
    const drawLines = (particles: Particle[], ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)

            // Set line color based on mode
            if (mode === "pentest") {
              ctx.strokeStyle = `rgba(0, ${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 155) + 100}, ${0.1 - distance / 1500})`
            } else {
              ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 155) + 100}, 0, ${Math.floor(Math.random() * 155) + 100}, ${0.1 - distance / 1500})`
            }

            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height)
        particle.draw(ctx)
      })

      drawLines(particles, ctx)
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [mode])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
