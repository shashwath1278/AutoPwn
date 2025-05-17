"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface DashboardCardProps {
  title: string
  icon: ReactNode
  children: ReactNode
  onClick?: () => void
}

export function DashboardCard({ title, icon, children, onClick }: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 shadow-lg overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <motion.div
          className="w-2 h-2 rounded-full bg-cyan-400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  )
}
