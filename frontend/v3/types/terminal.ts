export type TerminalOutputType = 'command' | 'response' | 'glitch' | 'ascii' | 'loading' | 'suggestion' | 'system'
export type TerminalOutputStyle = 'default' | 'error' | 'success' | 'warning' | 'info'

export interface TerminalOutputItem {
  type: TerminalOutputType
  content: string
  style?: TerminalOutputStyle
  timestamp?: number
  metadata?: {
    cpu?: number
    memory?: number
    connections?: number
    threatLevel?: string
    securityLevel?: string
    encryptionStatus?: string
    firewallStatus?: string
    [key: string]: any
  }
}

export interface Command {
  name: string
  description: string
  usage?: string
  category?: 'system' | 'user' | 'security' | 'network' | 'admin'
  handler: (args: string[]) => Promise<TerminalOutputItem[]>
}

export interface SystemMetrics {
  cpu: number
  memory: number
  connections: number
  uptime: number
  lastUpdate: number
  securityLevel: string
  encryptionStatus: string
  firewallStatus: string
  threatLevel: string
}