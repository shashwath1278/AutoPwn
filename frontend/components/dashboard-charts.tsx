"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface DashboardChartsProps {
  mode: "pentest" | "ctf"
}

export function DashboardCharts({ mode }: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for charts
  const overviewData = [
    { name: "Mon", scans: 4, vulnerabilities: 12, exploits: 2 },
    { name: "Tue", scans: 6, vulnerabilities: 18, exploits: 3 },
    { name: "Wed", scans: 8, vulnerabilities: 24, exploits: 5 },
    { name: "Thu", scans: 10, vulnerabilities: 30, exploits: 7 },
    { name: "Fri", scans: 12, vulnerabilities: 36, exploits: 9 },
    { name: "Sat", scans: 14, vulnerabilities: 42, exploits: 11 },
    { name: "Sun", scans: 16, vulnerabilities: 48, exploits: 13 },
  ]

  const vulnerabilityData = [
    { name: "Critical", value: 12, color: "#ff0000" },
    { name: "High", value: 18, color: "#ff8800" },
    { name: "Medium", value: 24, color: "#ffff00" },
    { name: "Low", value: 30, color: "#00ffff" },
    { name: "Info", value: 36, color: "#0088ff" },
  ]

  const ctfData = [
    { name: "Web", completed: 2, total: 5, points: 200 },
    { name: "Crypto", completed: 1, total: 3, points: 100 },
    { name: "Forensics", completed: 3, total: 4, points: 300 },
    { name: "Reverse", completed: 0, total: 2, points: 0 },
    { name: "Pwn", completed: 1, total: 3, points: 100 },
  ]

  return (
    <div>
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {mode === "pentest" ? (
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          ) : (
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 p-4">
            <h3 className="text-lg font-medium mb-4">Activity Overview</h3>
            <div className="h-80">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overviewData}>
                      <defs>
                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00ffff" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorVulnerabilities" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ff00ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExploits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff0000" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <ChartTooltip>
                                <ChartTooltipContent>
                                  {payload.map((entry) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                      <span>
                                        {entry.name}: {entry.value}
                                      </span>
                                    </div>
                                  ))}
                                </ChartTooltipContent>
                              </ChartTooltip>
                            )
                          }
                          return null
                        }}
                      />
                      <Area type="monotone" dataKey="scans" stroke="#00ffff" fillOpacity={1} fill="url(#colorScans)" />
                      <Area
                        type="monotone"
                        dataKey="vulnerabilities"
                        stroke="#ff00ff"
                        fillOpacity={1}
                        fill="url(#colorVulnerabilities)"
                      />
                      <Area
                        type="monotone"
                        dataKey="exploits"
                        stroke="#ff0000"
                        fillOpacity={1}
                        fill="url(#colorExploits)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend>
                  <ChartLegendItem name="Scans" color="#00ffff" />
                  <ChartLegendItem name="Vulnerabilities" color="#ff00ff" />
                  <ChartLegendItem name="Exploits" color="#ff0000" />
                </ChartLegend>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <div className="rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 p-4">
            <h3 className="text-lg font-medium mb-4">Vulnerability Distribution</h3>
            <div className="h-80">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vulnerabilityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {vulnerabilityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <ChartTooltip>
                                <ChartTooltipContent>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: payload[0].payload.color }}
                                    />
                                    <span>
                                      {payload[0].name}: {payload[0].value}
                                    </span>
                                  </div>
                                </ChartTooltipContent>
                              </ChartTooltip>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend>
                  {vulnerabilityData.map((item) => (
                    <ChartLegendItem key={item.name} name={item.name} color={item.color} />
                  ))}
                </ChartLegend>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="rounded-lg border border-border/40 backdrop-blur-sm bg-card/30 p-4">
            <h3 className="text-lg font-medium mb-4">Challenge Progress</h3>
            <div className="h-80">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ctfData}>
                      <XAxis dataKey="name" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <ChartTooltip>
                                <ChartTooltipContent>
                                  <div>
                                    <p className="font-medium">{payload[0].payload.name}</p>
                                    <p>
                                      Completed: {payload[0].payload.completed}/{payload[0].payload.total}
                                    </p>
                                    <p>Points: {payload[0].payload.points}</p>
                                  </div>
                                </ChartTooltipContent>
                              </ChartTooltip>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="points" fill="#ff0064" />
                    </BarChart>
                  </ResponsiveContainer>
                </Chart>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
