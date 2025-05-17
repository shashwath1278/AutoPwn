import { TerminalOutputItem, Command, SystemMetrics } from '@/types/terminal'

let systemMetrics: SystemMetrics = {
  cpu: 0,
  memory: 0,
  connections: 0,
  uptime: 0,
  lastUpdate: Date.now(),
  securityLevel: 'MAXIMUM',
  encryptionStatus: 'ACTIVE',
  firewallStatus: 'ENGAGED',
  threatLevel: 'LOW'
}

// Update system metrics every 2 seconds
setInterval(() => {
  systemMetrics = {
    ...systemMetrics,
    cpu: Math.random() * 100,
    memory: 30 + Math.random() * 40,
    connections: Math.floor(Math.random() * 1000),
    uptime: (Date.now() - systemMetrics.lastUpdate) / 1000,
    threatLevel: ['LOW', 'MODERATE', 'HIGH'][Math.floor(Math.random() * 3)]
  }
}, 2000)

const commands: Record<string, Command> = {
  help: {
    name: 'help',
    description: 'Display available commands',
    category: 'user',
    handler: async (args) => {
      const categories = {
        'SYSTEM COMMANDS': {
          status: 'Display system status',
          metrics: 'Show system metrics',
          analyze: 'System analysis',
          monitor: 'Monitor resources'
        },
        'SECURITY COMMANDS': {
          scan: 'Security scan',
          encrypt: 'Encrypt data',
          decrypt: 'Decrypt data',
          firewall: 'Firewall control'
        },
        'NETWORK COMMANDS': {
          trace: 'Trace connection',
          ping: 'Test connectivity',
          netstat: 'Network statistics',
          ports: 'Port scanner'
        },
        'USER COMMANDS': {
          help: 'Show this help',
          clear: 'Clear terminal',
          about: 'System info',
          time: 'Show time'
        }
      }

      if (args.length && args[0] in commands) {
        const cmd = commands[args[0]]
        return [
          { type: 'response', content: `Command: ${cmd.name}` },
          { type: 'response', content: `Description: ${cmd.description}` },
          { type: 'response', content: `Usage: ${cmd.usage || cmd.name}` },
          { type: 'response', content: `Category: ${cmd.category || 'user'}` }
        ]
      }

      const output: TerminalOutputItem[] = [
        { type: 'response', content: '╔════════════════════════════════════════════════════════════════════════════╗' },
        { type: 'response', content: '║                        QUANTUM SECURE TERMINAL v4.2.1                       ║' },
        { type: 'response', content: '╚════════════════════════════════════════════════════════════════════════════╝' },
      ]

      for (const [category, cmds] of Object.entries(categories)) {
        output.push({ type: 'response', content: '', style: 'info' })
        output.push({ type: 'response', content: category, style: 'info' })
        output.push({ type: 'response', content: '─'.repeat(category.length), style: 'info' })

        const commandEntries = Object.entries(cmds)
        const rows = Math.ceil(commandEntries.length / 2)

        for (let i = 0; i < rows; i++) {
          const row = commandEntries.slice(i * 2, i * 2 + 2)
          const formattedRow = row
            .map(([cmd, desc]) => `${cmd.padEnd(10)} │ ${desc.padEnd(20)}`)
            .join('   ')
          output.push({ type: 'response', content: formattedRow })
        }
      }

      output.push({ type: 'response', content: '', style: 'info' })
      output.push({ 
        type: 'response', 
        content: 'Type "help <command>" for detailed information about a specific command.',
        style: 'info'
      })

      return output
    }
  },

  scan: {
    name: 'scan',
    description: 'Perform security scan',
    category: 'security',
    handler: async () => {
      const scanSteps = [
        'Initializing security protocols...',
        'Scanning for vulnerabilities...',
        'Analyzing network traffic...',
        'Checking encryption status...',
        'Monitoring system integrity...',
        'Detecting potential threats...',
        'Generating security report...'
      ]

      const results: TerminalOutputItem[] = []

      for (const step of scanSteps) {
        results.push({ type: 'loading', content: step })
        await new Promise(resolve => setTimeout(resolve, 400))
      }

      return [
        ...results,
        { type: 'glitch', content: 'SECURITY SCAN COMPLETE' },
        { 
          type: 'system',
          content: 'Security Analysis Report',
          metadata: {
            threatLevel: systemMetrics.threatLevel,
            vulnerabilities: 0,
            encryptionStatus: 'ACTIVE',
            firewallStatus: 'ENGAGED',
            lastBreach: 'NONE',
            securityScore: '98.7%'
          }
        }
      ]
    }
  },

  encrypt: {
    name: 'encrypt',
    description: 'Encrypt data or communications',
    category: 'security',
    handler: async (args) => {
      if (!args.length) {
        return [{ type: 'response', content: 'Usage: encrypt <data>', style: 'error' }]
      }

      const data = args.join(' ')
      const encrypted = Buffer.from(data).toString('base64')

      return [
        { type: 'loading', content: 'Initializing quantum encryption...' },
        { type: 'loading', content: 'Generating encryption keys...' },
        { type: 'loading', content: 'Applying encryption algorithm...' },
        { type: 'response', content: `Original: ${data}` },
        { type: 'response', content: `Encrypted: ${encrypted}` },
        { type: 'glitch', content: 'ENCRYPTION COMPLETE' }
      ]
    }
  },

  decrypt: {
    name: 'decrypt',
    description: 'Decrypt encrypted data',
    category: 'security',
    handler: async (args) => {
      if (!args.length) {
        return [{ type: 'response', content: 'Usage: decrypt <encrypted_data>', style: 'error' }]
      }

      try {
        const encrypted = args.join(' ')
        const decrypted = Buffer.from(encrypted, 'base64').toString()

        return [
          { type: 'loading', content: 'Initializing decryption sequence...' },
          { type: 'loading', content: 'Verifying encryption keys...' },
          { type: 'loading', content: 'Applying decryption algorithm...' },
          { type: 'response', content: `Encrypted: ${encrypted}` },
          { type: 'response', content: `Decrypted: ${decrypted}` },
          { type: 'glitch', content: 'DECRYPTION COMPLETE' }
        ]
      } catch {
        return [{ type: 'response', content: 'Error: Invalid encrypted data', style: 'error' }]
      }
    }
  },

  firewall: {
    name: 'firewall',
    description: 'Manage system firewall',
    category: 'security',
    handler: async (args) => {
      const validCommands = ['status', 'enable', 'disable', 'rules']
      const command = args[0] || 'status'

      if (!validCommands.includes(command)) {
        return [{ 
          type: 'response', 
          content: `Usage: firewall [${validCommands.join('|')}]`,
          style: 'error'
        }]
      }

      const results: TerminalOutputItem[] = [
        { type: 'loading', content: 'Accessing firewall systems...' }
      ]

      await new Promise(resolve => setTimeout(resolve, 500))

      switch (command) {
        case 'status':
          return [
            ...results,
            { type: 'glitch', content: 'FIREWALL STATUS: ACTIVE' },
            { 
              type: 'system',
              content: 'Firewall Analysis',
              metadata: {
                status: 'ACTIVE',
                rules: 256,
                blockedAttempts: Math.floor(Math.random() * 10000),
                lastUpdate: new Date().toISOString(),
                threatProtection: 'MAXIMUM'
              }
            }
          ]
        case 'rules':
          return [
            ...results,
            { type: 'response', content: 'Active Firewall Rules:' },
            { type: 'response', content: '- Block unauthorized port scans' },
            { type: 'response', content: '- Prevent DDoS attacks' },
            { type: 'response', content: '- Filter malicious packets' },
            { type: 'response', content: '- Monitor suspicious activity' },
            { type: 'glitch', content: 'FIREWALL PROTECTION: OPTIMAL' }
          ]
        default:
          return [
            ...results,
            { type: 'response', content: `Firewall ${command} command executed`, style: 'success' }
          ]
      }
    }
  },

  about: {
    name: 'about',
    description: 'Display system information',
    category: 'user',
    handler: async () => [
      { type: 'ascii', content: `
   ███████ ███████  ██████      ██    ██ ██████  
   ██      ██      ██           ██    ██ ██   ██ 
   ███████ █████   ██           ██    ██ ██████  
        ██ ██      ██           ██    ██ ██      
   ███████ ███████  ██████       ██████  ██      
` },
      { type: 'response', content: 'Secure Environment Computing v4.2.1' },
      { type: 'response', content: 'Advanced Cybersecurity Terminal Interface' },
      { type: 'response', content: '© 2025 SecOps Division. All rights reserved.' },
      { 
        type: 'system',
        content: 'Security Status',
        metadata: { ...systemMetrics }
      }
    ]
  },

  status: {
    name: 'status',
    description: 'Show system security status',
    category: 'system',
    handler: async () => {
      const { cpu, memory, connections, uptime, threatLevel } = systemMetrics
      return [
        { type: 'response', content: 'SECURITY SYSTEM STATUS', style: 'info' },
        { type: 'response', content: '━━━━━━━━━━━━━━━━━━━━' },
        { type: 'response', content: `Threat Level: ${threatLevel}` },
        { type: 'response', content: `Security Rating: MAXIMUM` },
        { type: 'response', content: `Firewall Status: ACTIVE` },
        { type: 'response', content: `Encryption: ENABLED` },
        { type: 'response', content: `CPU Usage: ${cpu.toFixed(1)}%` },
        { type: 'response', content: `Memory: ${memory.toFixed(1)}%` },
        { type: 'response', content: `Active Connections: ${connections}` },
        { type: 'response', content: `System Uptime: ${uptime.toFixed(0)}s` }
      ]
    }
  },

  time: {
    name: 'time',
    description: 'Show current time and date',
    category: 'user',
    handler: async () => {
      const now = new Date()
      return [
        { type: 'response', content: `System Time: ${now.toLocaleTimeString()}` },
        { type: 'response', content: `Date: ${now.toLocaleDateString()}` },
        { type: 'response', content: `Unix Timestamp: ${Math.floor(Date.now() / 1000)}` }
      ]
    }
  },

  echo: {
    name: 'echo',
    description: 'Echo back the provided text',
    usage: 'echo [text]',
    category: 'user',
    handler: async (args) => {
      const text = args.join(' ')
      return [
        { type: 'response', content: text || 'Usage: echo [text]' }
      ]
    }
  }
}

/**
 * Process a command and return the appropriate response
 * @param commandLine The full command line input
 * @param signal Optional AbortSignal for cancelling command execution
 * @returns Promise<TerminalOutputItem[]> The command response
 */
export function processCommand(
  commandLine: string,
  signal?: AbortSignal
): Promise<TerminalOutputItem[]> {
  const parts = commandLine.trim().split(' ')
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)
  
  if (command in commands) {
    return commands[command].handler(args)
  }
  
  if (command === '') {
    return Promise.resolve([])
  }
  
  return Promise.resolve([
    { type: 'response', content: `Command not found: ${command}`, style: 'error' },
    { type: 'response', content: 'Type "help" for available commands.' }
  ])
}

/**
 * Get command suggestions based on input
 * @param input The partial command input
 * @returns string[] Array of matching command suggestions
 */
export function getCommandSuggestions(input: string): string[] {
  if (!input) return []
  return Object.keys(commands).filter(cmd => cmd.startsWith(input.toLowerCase()))
}

/**
 * Get system metrics
 * @returns SystemMetrics Current system metrics
 */
export function getSystemMetrics(): SystemMetrics {
  return { ...systemMetrics }
}