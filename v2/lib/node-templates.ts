import { Node } from 'reactflow'

interface NodeTemplate extends Node {
  category: string
  description: string
}

const templates: NodeTemplate[] = [
  // Initial Access
  {
    id: 'spear-phishing-macro',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Spear Phishing + Macro',
      description: 'Targeted phishing with macro-enabled Office documents',
      category: 'initial',
      mitreTechnique: 'T1566.001',
      defenses: ['Email filtering', 'Macro security', 'EDR', 'User training'],
      stats: {
        complexity: 'Medium',
        impact: 'High',
        detection: 'Medium'
      }
    },
    category: 'initial',
    description: 'Spear phishing with macros'
  },
  {
    id: 'watering-hole',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Watering Hole',
      description: 'Strategic compromise of legitimate websites targeting specific users',
      category: 'initial',
      mitreTechnique: 'T1189',
      defenses: ['Web filtering', 'Browser isolation', 'EDR'],
      stats: {
        complexity: 'High',
        impact: 'Critical',
        detection: 'Low'
      }
    },
    category: 'initial',
    description: 'Watering hole attack'
  },
  {
    id: 'malicious-usb',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Malicious USB Drop',
      description: 'Strategic placement of infected USB devices',
      category: 'initial',
      mitreTechnique: 'T1091',
      defenses: ['USB control', 'Physical security', 'EDR'],
      stats: {
        complexity: 'Low',
        impact: 'High',
        detection: 'Medium'
      }
    },
    category: 'initial',
    description: 'USB drop attack'
  },

  // Reconnaissance
  {
    id: 'osint-profiling',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'OSINT Profiling',
      description: 'Intelligence gathering from LinkedIn, Github, Dark Web',
      category: 'reconnaissance',
      mitreTechnique: 'T1589',
      defenses: ['Information control', 'Digital footprint monitoring'],
      stats: {
        complexity: 'Low',
        impact: 'Low',
        detection: 'Low'
      }
    },
    category: 'reconnaissance',
    description: 'OSINT gathering'
  },
  {
    id: 'subdomain-enum',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Asset Discovery',
      description: 'Subdomain enumeration and exposed asset discovery',
      category: 'reconnaissance',
      mitreTechnique: 'T1590',
      defenses: ['Asset inventory', 'DNS monitoring'],
      stats: {
        complexity: 'Low',
        impact: 'Low',
        detection: 'Medium'
      }
    },
    category: 'reconnaissance',
    description: 'Asset discovery'
  },
  {
    id: 'shodan-scan',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Shodan Scanning',
      description: 'Internet-wide scanning using Shodan and Censys',
      category: 'reconnaissance',
      mitreTechnique: 'T1595',
      defenses: ['Asset monitoring', 'Exposure management'],
      stats: {
        complexity: 'Low',
        impact: 'Low',
        detection: 'Medium'
      }
    },
    category: 'reconnaissance',
    description: 'Shodan reconnaissance'
  },

  // Exploitation
  {
    id: 'zero-day',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Zero-Day RCE',
      description: 'Exploitation of unknown remote code execution vulnerability',
      category: 'exploitation',
      mitreTechnique: 'T1190',
      defenses: ['Zero-trust architecture', 'Network segmentation', 'EDR'],
      stats: {
        complexity: 'High',
        impact: 'Critical',
        detection: 'Low'
      }
    },
    category: 'exploitation',
    description: 'Zero-day exploitation'
  },
  {
    id: 'sql-injection',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'SQL Injection',
      description: 'Database manipulation for data exfiltration',
      category: 'exploitation',
      mitreTechnique: 'T1190',
      defenses: ['Prepared statements', 'WAF', 'Input validation'],
      stats: {
        complexity: 'Medium',
        impact: 'Critical',
        detection: 'High'
      }
    },
    category: 'exploitation',
    description: 'SQL injection attack'
  },
  {
    id: 'ssrf-pivot',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'SSRF to Pivot',
      description: 'Server-Side Request Forgery for internal network access',
      category: 'exploitation',
      mitreTechnique: 'T1090',
      defenses: ['URL validation', 'Network segmentation', 'Access controls'],
      stats: {
        complexity: 'High',
        impact: 'Critical',
        detection: 'Medium'
      }
    },
    category: 'exploitation',
    description: 'SSRF attack'
  },

  // Privilege Escalation
  {
    id: 'kernel-exploit',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Kernel Exploit',
      description: 'Local privilege escalation via kernel vulnerability',
      category: 'privilege',
      mitreTechnique: 'T1068',
      defenses: ['Patch management', 'EDR', 'Kernel hardening'],
      stats: {
        complexity: 'High',
        impact: 'Critical',
        detection: 'Medium'
      }
    },
    category: 'privilege',
    description: 'Kernel exploitation'
  },
  {
    id: 'dll-hijack',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'DLL Hijacking',
      description: 'Privilege escalation through DLL search order abuse',
      category: 'privilege',
      mitreTechnique: 'T1574.001',
      defenses: ['Application control', 'Secure DLL loading'],
      stats: {
        complexity: 'Medium',
        impact: 'High',
        detection: 'Medium'
      }
    },
    category: 'privilege',
    description: 'DLL hijacking'
  },
  {
    id: 'sudo-misconfig',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Sudo Misconfig',
      description: 'Exploitation of sudo configuration weaknesses',
      category: 'privilege',
      mitreTechnique: 'T1548.003',
      defenses: ['Sudo audit', 'Least privilege', 'Configuration review'],
      stats: {
        complexity: 'Low',
        impact: 'Critical',
        detection: 'High'
      }
    },
    category: 'privilege',
    description: 'Sudo misconfiguration'
  },

  // Lateral Movement
  {
    id: 'smb-relay',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'SMB Relay',
      description: 'Network authentication relay attack',
      category: 'lateral',
      mitreTechnique: 'T1557',
      defenses: ['SMB signing', 'Network segmentation'],
      stats: {
        complexity: 'Medium',
        impact: 'High',
        detection: 'Medium'
      }
    },
    category: 'lateral',
    description: 'SMB relay attack'
  },
  {
    id: 'ssh-key-reuse',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'SSH Key Reuse',
      description: 'Lateral movement using discovered SSH keys',
      category: 'lateral',
      mitreTechnique: 'T1021.004',
      defenses: ['Key rotation', 'Access monitoring'],
      stats: {
        complexity: 'Low',
        impact: 'High',
        detection: 'Medium'
      }
    },
    category: 'lateral',
    description: 'SSH key reuse'
  },

  // Command & Control
  {
    id: 'dns-tunnel',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'DNS Tunneling',
      description: 'C2 communication through DNS protocol',
      category: 'c2',
      mitreTechnique: 'T1071.004',
      defenses: ['DNS monitoring', 'DNS filtering'],
      stats: {
        complexity: 'High',
        impact: 'Medium',
        detection: 'Medium'
      }
    },
    category: 'c2',
    description: 'DNS tunneling'
  },
  {
    id: 'social-media-c2',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Social Media C2',
      description: 'Command & Control using Twitter/Telegram bots',
      category: 'c2',
      mitreTechnique: 'T1102',
      defenses: ['Web filtering', 'Traffic analysis'],
      stats: {
        complexity: 'Medium',
        impact: 'Medium',
        detection: 'Low'
      }
    },
    category: 'c2',
    description: 'Social media C2'
  },

  // Persistence
  {
    id: 'registry-run',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Registry Run Keys',
      description: 'Windows persistence via startup registry',
      category: 'persistence',
      mitreTechnique: 'T1547.001',
      defenses: ['Registry monitoring', 'AppLocker'],
      stats: {
        complexity: 'Low',
        impact: 'High',
        detection: 'Medium'
      }
    },
    category: 'persistence',
    description: 'Registry persistence'
  },
  {
    id: 'crontab-job',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Crontab Injection',
      description: 'Linux persistence via crontab jobs',
      category: 'persistence',
      mitreTechnique: 'T1053.003',
      defenses: ['Cron monitoring', 'File integrity'],
      stats: {
        complexity: 'Low',
        impact: 'High',
        detection: 'Medium'
      }
    },
    category: 'persistence',
    description: 'Crontab persistence'
  },

  // Exfiltration
  {
    id: 'steganography',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Steganography',
      description: 'Data hiding in media files for exfiltration',
      category: 'exfiltration',
      mitreTechnique: 'T1027',
      defenses: ['DLP', 'File analysis'],
      stats: {
        complexity: 'High',
        impact: 'Medium',
        detection: 'Low'
      }
    },
    category: 'exfiltration',
    description: 'Steganographic exfiltration'
  },
  {
    id: 'dns-exfil',
    type: 'attackNode',
    position: { x: 0, y: 0 },
    data: { 
      label: 'DNS Exfiltration',
      description: 'Data exfiltration via DNS TXT records',
      category: 'exfiltration',
      mitreTechnique: 'T1048.001',
      defenses: ['DNS monitoring', 'Data classification'],
      stats: {
        complexity: 'High',
        impact: 'High',
        detection: 'Medium'
      }
    },
    category: 'exfiltration',
    description: 'DNS exfiltration'
  }
]

// Attack flow templates
export const flowTemplates = [
  {
    id: 'advanced-persistent-threat',
    name: 'APT Campaign',
    description: 'Sophisticated APT attack chain with multiple stages',
    nodes: [
      {
        id: 'recon-1',
        type: 'attackNode',
        position: { x: 100, y: 100 },
        data: templates.find(t => t.id === 'osint-profiling')?.data
      },
      {
        id: 'initial-1',
        type: 'attackNode',
        position: { x: 300, y: 100 },
        data: templates.find(t => t.id === 'spear-phishing-macro')?.data
      },
      {
        id: 'exploit-1',
        type: 'attackNode',
        position: { x: 500, y: 100 },
        data: templates.find(t => t.id === 'zero-day')?.data
      },
      {
        id: 'lateral-1',
        type: 'attackNode',
        position: { x: 700, y: 100 },
        data: templates.find(t => t.id === 'smb-relay')?.data
      },
      {
        id: 'persist-1',
        type: 'attackNode',
        position: { x: 900, y: 100 },
        data: templates.find(t => t.id === 'registry-run')?.data
      }
    ],
    edges: [
      { id: 'e1-2', source: 'recon-1', target: 'initial-1' },
      { id: 'e2-3', source: 'initial-1', target: 'exploit-1' },
      { id: 'e3-4', source: 'exploit-1', target: 'lateral-1' },
      { id: 'e4-5', source: 'lateral-1', target: 'persist-1' }
    ]
  },
  {
    id: 'internal-network-pivot',
    name: 'Internal Network Pivot',
    description: 'Internal network compromise and lateral movement',
    nodes: [
      {
        id: 'initial-1',
        type: 'attackNode',
        position: { x: 100, y: 100 },
        data: templates.find(t => t.id === 'ssrf-pivot')?.data
      },
      {
        id: 'privesc-1',
        type: 'attackNode',
        position: { x: 300, y: 100 },
        data: templates.find(t => t.id === 'sudo-misconfig')?.data
      },
      {
        id: 'lateral-1',
        type: 'attackNode',
        position: { x: 500, y: 100 },
        data: templates.find(t => t.id === 'ssh-key-reuse')?.data
      },
      {
        id: 'persist-1',
        type: 'attackNode',
        position: { x: 700, y: 100 },
        data: templates.find(t => t.id === 'crontab-job')?.data
      }
    ],
    edges: [
      { id: 'e1-2', source: 'initial-1', target: 'privesc-1' },
      { id: 'e2-3', source: 'privesc-1', target: 'lateral-1' },
      { id: 'e3-4', source: 'lateral-1', target: 'persist-1' }
    ]
  },
  {
    id: 'stealth-exfiltration',
    name: 'Stealth Data Exfiltration',
    description: 'Covert data exfiltration campaign',
    nodes: [
      {
        id: 'initial-1',
        type: 'attackNode',
        position: { x: 100, y: 100 },
        data: templates.find(t => t.id === 'sql-injection')?.data
      },
      {
        id: 'c2-1',
        type: 'attackNode',
        position: { x: 300, y: 100 },
        data: templates.find(t => t.id === 'social-media-c2')?.data
      },
      {
        id: 'exfil-1',
        type: 'attackNode',
        position: { x: 500, y: 100 },
        data: templates.find(t => t.id === 'steganography')?.data
      }
    ],
    edges: [
      { id: 'e1-2', source: 'initial-1', target: 'c2-1' },
      { id: 'e2-3', source: 'c2-1', target: 'exfil-1' }
    ]
  },
  {
    id: 'physical-access',
    name: 'Physical Access Attack',
    description: 'Attack chain starting with physical access',
    nodes: [
      {
        id: 'initial-1',
        type: 'attackNode',
        position: { x: 100, y: 100 },
        data: templates.find(t => t.id === 'malicious-usb')?.data
      },
      {
        id: 'privesc-1',
        type: 'attackNode',
        position: { x: 300, y: 100 },
        data: templates.find(t => t.id === 'dll-hijack')?.data
      },
      {
        id: 'persist-1',
        type: 'attackNode',
        position: { x: 500, y: 100 },
        data: templates.find(t => t.id === 'registry-run')?.data
      },
      {
        id: 'exfil-1',
        type: 'attackNode',
        position: { x: 700, y: 100 },
        data: templates.find(t => t.id === 'dns-exfil')?.data
      }
    ],
    edges: [
      { id: 'e1-2', source: 'initial-1', target: 'privesc-1' },
      { id: 'e2-3', source: 'privesc-1', target: 'persist-1' },
      { id: 'e3-4', source: 'persist-1', target: 'exfil-1' }
    ]
  },
  {
    id: 'web-app-attack',
    name: 'Web Application Attack',
    description: 'Multi-stage web application compromise',
    nodes: [
      {
        id: 'recon-1',
        type: 'attackNode',
        position: { x: 100, y: 100 },
        data: templates.find(t => t.id === 'subdomain-enum')?.data
      },
      {
        id: 'initial-1',
        type: 'attackNode',
        position: { x: 300, y: 100 },
        data: templates.find(t => t.id === 'sql-injection')?.data
      },
      {
        id: 'c2-1',
        type: 'attackNode',
        position: { x: 500, y: 100 },
        data: templates.find(t => t.id === 'dns-tunnel')?.data
      },
      {
        id: 'exfil-1',
        type: 'attackNode',
        position: { x: 700, y: 100 },
        data: templates.find(t => t.id === 'steganography')?.data
      }
    ],
    edges: [
      { id: 'e1-2', source: 'recon-1', target: 'initial-1' },
      { id: 'e2-3', source: 'initial-1', target: 'c2-1' },
      { id: 'e3-4', source: 'c2-1', target: 'exfil-1' }
    ]
  },
  {
    id: 'social-engineering',
    name: 'Social Engineering Campaign',
    description: 'Advanced social engineering attack chain',
    nodes: [
      {
        id: 'recon-1',
        type: 'attackNode',
        position: { x: 100, y: 100 },
        data: templates.find(t => t.id === 'osint-profiling')?.data
      },
      {
        id: 'initial-1',
        type: 'attackNode',
        position: { x: 300, y: 100 },
        data: templates.find(t => t.id === 'spear-phishing-macro')?.data
      },
      {
        id: 'c2-1',
        type: 'attackNode',
        position: { x: 500, y: 100 },
        data: templates.find(t => t.id === 'social-media-c2')?.data
      },
      {
        id: 'persist-1',
        type: 'attackNode',
        position: { x: 700, y: 100 },
        data: templates.find(t => t.id === 'crontab-job')?.data
      }
    ],
    edges: [
      { id: 'e1-2', source: 'recon-1', target: 'initial-1' },
      { id: 'e2-3', source: 'initial-1', target: 'c2-1' },
      { id: 'e3-4', source: 'c2-1', target: 'persist-1' }
    ]
  }
]

export function getNodeTemplates(category?: string): NodeTemplate[] {
  if (!category) return templates
  return templates.filter(template => template.category === category)
}

export function getFlowTemplates() {
  return flowTemplates
}