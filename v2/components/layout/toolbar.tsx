"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, AlignCenter, Database, Download, Layers, Play, Pause, SkipForward, 
  Save, Search, Share2, Workflow, Zap
} from 'lucide-react'
import { useSimulation } from '../../context/simulation-context'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Separator } from '../ui/separator'
import { ExportMenu } from '../export/export-menu'
import { useNode } from '../../context/node-context'
import { toast } from 'sonner'

export default function Toolbar(): React.ReactNode {
  const { isPlaying, togglePlay, stepForward } = useSimulation()
  const { nodes, edges } = useNode()
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSave = () => {
    const flow = { nodes, edges }
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'attack-flow.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Flow saved successfully')
  }

  const handleSearch = () => {
    toast.info('Search functionality coming soon')
  }

  const handleActivityMonitor = () => {
    toast.info('Activity monitor coming soon')
  }

  const handleLayerToggle = () => {
    toast.info('Layer management coming soon')
  }

  const handleAlign = () => {
    toast.info('Auto-align functionality coming soon')
  }

  const handleShare = () => {
    toast.info('Share functionality coming soon')
  }

  const handleLoadMitre = () => {
    toast.info('MITRE data integration coming soon')
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Attack flow analysis complete')
    } catch (error) {
      toast.error('Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <motion.div 
      className="toolbar w-full h-14 px-4 flex items-center justify-between z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2">
        <Workflow className="h-6 w-6 text-primary glow-text" />
        <h1 className="text-lg font-mono font-bold tracking-tight text-primary glow-text">
          Attack Flow Builder
        </h1>
      </div>

      <TooltipProvider>
        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search (Ctrl+F)</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 ${isPlaying ? 'text-success' : ''}`}
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isPlaying ? 'Pause' : 'Play'} Simulation</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={stepForward}
                disabled={!isPlaying}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Step Forward</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleActivityMonitor}
              >
                <Activity className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Activity Monitor</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleLayerToggle}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Layers</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleAlign}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save (Ctrl+S)</TooltipContent>
          </Tooltip>

          <ExportMenu />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleLoadMitre}
              >
                <Database className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load MITRE Data</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                <Zap className={`h-4 w-4 mr-2 ${isAnalyzing ? 'text-primary animate-pulse' : 'text-accent'}`} />
                <span className="text-xs font-mono">
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Analyze Attack Flow</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </motion.div>
  )
}