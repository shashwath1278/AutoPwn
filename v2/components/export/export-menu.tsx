"use client"

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Button } from '../../components/ui/button'
import { Download } from 'lucide-react'
import { useNode } from '../../context/node-context'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'

export function ExportMenu() {
  const { nodes, edges } = useNode()

  const handleExportJSON = () => {
    try {
      const flow = { nodes, edges }
      const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'attack-flow.json'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Flow exported as JSON')
    } catch (error) {
      toast.error('Failed to export JSON')
    }
  }

  const handleExportImage = async () => {
    try {
      const canvasElement = document.querySelector('.react-flow')
      if (!canvasElement) {
        throw new Error('Canvas element not found')
      }

      const canvas = await html2canvas(canvasElement as HTMLElement, {
        backgroundColor: '#0a0a0a',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      })

      const image = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = image
      a.download = 'attack-flow.png'
      a.click()
      toast.success('Flow exported as image')
    } catch (error) {
      toast.error('Failed to export image')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportJSON}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportImage}>
          Export as Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}