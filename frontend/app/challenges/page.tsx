"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Flag, Filter, Search, Award, Clock, Target, Zap, Code, Shield, Bug, Terminal, Lock, FileText } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AIAgentPanel } from "@/components/ai-agent-panel"

interface Challenge {
  id: string
  title: string
  category: "web" | "crypto" | "pwn" | "forensics" | "misc" | "reverse"
  difficulty: "easy" | "medium" | "hard" | "insane"
  points: number
  solved: boolean
  solvedCount: number
  description: string
  hint?: string
  icon: React.ElementType
}

const CATEGORIES = {
  web: { name: "Web", icon: Code, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  crypto: { name: "Crypto", icon: Lock, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  pwn: { name: "Pwn", icon: Bug, color: "bg-red-500/20 text-red-400 border-red-500/30" },
  forensics: { name: "Forensics", icon: Search, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  misc: { name: "Misc", icon: Target, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  reverse: { name: "Reverse", icon: Terminal, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" }
};

const DIFFICULTY = {
  easy: { name: "Easy", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  medium: { name: "Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  hard: { name: "Hard", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  insane: { name: "Insane", color: "bg-red-500/20 text-red-400 border-red-500/30" }
};

export default function ChallengesPage() {
  const [mode, setMode] = useState<"pentest" | "ctf">("ctf")
  const [aiAgentMinimized, setAiAgentMinimized] = useState(true)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<string>("all")

  const challenges: Challenge[] = [
    {
      id: "web-1",
      title: "SQL Injection Basics",
      category: "web",
      difficulty: "easy",
      points: 100,
      solved: true,
      solvedCount: 124,
      description: "An introductory challenge to SQL injection. Login to the admin panel without knowing the password.",
      icon: Code
    },
    {
      id: "web-2",
      title: "XSS Adventures",
      category: "web",
      difficulty: "medium",
      points: 200,
      solved: false,
      solvedCount: 75,
      description: "Find a cross-site scripting vulnerability that allows you to steal cookies from the admin.",
      icon: Code
    },
    {
      id: "crypto-1",
      title: "Caesar's Secret",
      category: "crypto",
      difficulty: "easy",
      points: 100,
      solved: true,
      solvedCount: 145,
      description: "Decrypt this message that was encrypted using a Caesar cipher.",
      icon: Lock
    },
    {
      id: "crypto-2",
      title: "RSA Madness",
      category: "crypto",
      difficulty: "hard",
      points: 300,
      solved: false,
      solvedCount: 32,
      description: "Break this RSA encryption using the provided public key and ciphertext.",
      hint: "Check if the modulus is secure...",
      icon: Lock
    },
    {
      id: "pwn-1",
      title: "Buffer Overflow 101",
      category: "pwn",
      difficulty: "medium",
      points: 200,
      solved: false,
      solvedCount: 68,
      description: "Exploit a classic buffer overflow vulnerability to get the flag.",
      icon: Bug
    },
    {
      id: "forensics-1",
      title: "Hidden in Plain Sight",
      category: "forensics",
      difficulty: "easy",
      points: 100,
      solved: true,
      solvedCount: 132,
      description: "Extract the hidden data from this innocent-looking image.",
      icon: Search
    },
    {
      id: "reverse-1",
      title: "Binary Puzzle",
      category: "reverse",
      difficulty: "insane",
      points: 500,
      solved: false,
      solvedCount: 12,
      description: "Reverse engineer this binary to find the correct input that produces the flag.",
      icon: Terminal
    },
  ]

  const filteredChallenges = challenges.filter(challenge => {
    if (searchQuery && !challenge.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filter !== "all" && filter !== challenge.category && filter !== challenge.difficulty && filter !== (challenge.solved ? "solved" : "unsolved")) {
      return false
    }
    return true
  })

  const totalPoints = challenges.reduce((sum, challenge) => sum + challenge.points, 0)
  const earnedPoints = challenges.filter(c => c.solved).reduce((sum, challenge) => sum + challenge.points, 0)
  const progressPercentage = Math.round((earnedPoints / totalPoints) * 100)

  return (
    <DashboardLayout mode={mode} setMode={setMode}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 mb-1">
              CTF Challenges
            </h1>
            <p className="text-muted-foreground text-sm">Test your skills with our collection of cybersecurity challenges</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 py-1 px-3">
              <Award className="h-3.5 w-3.5 text-yellow-400" />
              <span>{earnedPoints} / {totalPoints} points</span>
            </Badge>
            
            <Badge variant="outline" className="gap-1 py-1 px-3">
              <Flag className="h-3.5 w-3.5 text-orange-400" />
              <span>{challenges.filter(c => c.solved).length} / {challenges.length} solved</span>
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-secondary/50 p-4 rounded-lg border border-border/40 shadow-sm">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-muted-foreground">Your progress</span>
            <span className="text-orange-400">{progressPercentage}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" indicatorClassName="bg-gradient-to-r from-orange-500 to-red-500" />
        </div>
        
        {/* Challenge filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search challenges..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <select 
              className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="web">Web</option>
              <option value="crypto">Crypto</option>
              <option value="pwn">Pwn</option>
              <option value="forensics">Forensics</option>
              <option value="reverse">Reverse</option>
              <option value="misc">Misc</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="insane">Insane</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
          </div>
        </div>

        {/* Challenge grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const CategoryIcon = CATEGORIES[challenge.category].icon;
            const categoryStyle = CATEGORIES[challenge.category].color;
            const difficultyStyle = DIFFICULTY[challenge.difficulty].color;
            
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${challenge.solved ? 'ring-1 ring-orange-500/20' : ''}`}
                onClick={() => setSelectedChallenge(challenge)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-md ${categoryStyle} inline-flex items-center gap-1.5 text-xs`}>
                      <CategoryIcon className="h-3 w-3" />
                      {CATEGORIES[challenge.category].name}
                    </div>
                    
                    {challenge.solved && (
                      <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/30">
                        Solved
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className={`text-lg font-medium mb-2 ${challenge.solved ? 'text-orange-400' : ''}`}>
                    {challenge.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {challenge.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className={`px-2 py-0.5 rounded-full text-xs ${difficultyStyle}`}>
                      {DIFFICULTY[challenge.difficulty].name}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-yellow-400" />
                        <span>{challenge.points} pts</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Flag className="h-3.5 w-3.5" />
                        <span>{challenge.solvedCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No challenges found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Challenge Detail Dialog */}
        {selectedChallenge && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className={`p-2 rounded-md ${CATEGORIES[selectedChallenge.category].color} inline-flex items-center gap-1.5 text-xs mb-2`}>
                      <selectedChallenge.icon className="h-3 w-3" />
                      {CATEGORIES[selectedChallenge.category].name}
                    </div>
                    <h2 className="text-2xl font-bold">{selectedChallenge.title}</h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedChallenge(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-3 mb-6">
                  <div className={`px-3 py-1 rounded-full text-xs ${DIFFICULTY[selectedChallenge.difficulty].color}`}>
                    {DIFFICULTY[selectedChallenge.difficulty].name}
                  </div>
                  
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs">
                    <Award className="h-3.5 w-3.5" />
                    <span>{selectedChallenge.points} points</span>
                  </div>
                  
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground text-xs">
                    <Flag className="h-3.5 w-3.5" />
                    <span>{selectedChallenge.solvedCount} solves</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedChallenge.description}</p>
                </div>
                
                {selectedChallenge.hint && (
                  <div className="mb-6 p-3 bg-secondary/50 border border-border rounded-md">
                    <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      Hint
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedChallenge.hint}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Submit Flag</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Enter flag here (format: flag{...})" />
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                      Submit
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" className="gap-2" onClick={() => setAiAgentMinimized(false)}>
                    <Bot className="h-4 w-4" />
                    Ask AI for Help
                  </Button>
                  
                  <div className="space-x-2">
                    <Button variant="secondary">Download Files</Button>
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      Launch Challenge
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      
      {/* AI Agent */}
      <AIAgentPanel 
        mode="ctf"
        minimized={aiAgentMinimized}
        onMinimize={() => setAiAgentMinimized(true)}
        onMaximize={() => setAiAgentMinimized(false)}
        className={aiAgentMinimized ? "" : "fixed bottom-4 right-4 w-[400px] h-[500px]"}
      />
    </DashboardLayout>
  )
}
