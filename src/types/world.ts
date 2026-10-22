export type AgentState =
  | 'idle'
  | 'working'
  | 'thinking'
  | 'waiting'
  | 'review'
  | 'done'
  | 'error'
  | 'offline';

export interface StateConfig {
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  iconName: string;
}

export const AGENT_STATES_CONFIG: Record<AgentState, StateConfig> = {
  idle: {
    label: 'En veille / Disponible',
    shortLabel: 'IDLE',
    description: "L'agent est connecté au réseau neural, prêt pour une nouvelle assignation.",
    color: '#38bdf8', // Cyan 400
    badgeBg: 'bg-cyan-500/15',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    iconName: 'Power',
  },
  working: {
    label: 'Mission en cours',
    shortLabel: 'WORKING',
    description: "Exécution active des sous-tâches et traitement des flux de données.",
    color: '#06b6d4', // Cyan
    badgeBg: 'bg-cyan-500/20',
    textColor: 'text-cyan-300',
    borderColor: 'border-cyan-500/40',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    iconName: 'Activity',
  },
  thinking: {
    label: 'Traitement & Planification',
    shortLabel: 'THINKING',
    description: "Calcul d'inférence, synthèse multimodale ou optimisation heuristique.",
    color: '#818cf8', // Indigo 400
    badgeBg: 'bg-indigo-500/20',
    textColor: 'text-indigo-300',
    borderColor: 'border-indigo-500/40',
    glowColor: 'rgba(129, 140, 248, 0.5)',
    iconName: 'Cpu',
  },
  waiting: {
    label: 'Attente de dépendance',
    shortLabel: 'WAITING',
    description: "En attente du retour d'un agent tiers ou d'une ressource réseau.",
    color: '#fbbf24', // Amber
    badgeBg: 'bg-amber-500/15',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    iconName: 'Clock',
  },
  review: {
    label: 'En attente de validation',
    shortLabel: 'REVIEW',
    description: "Livrable finalisé en attente d'approbation humaine (Human-in-the-Loop).",
    color: '#c084fc', // Purple
    badgeBg: 'bg-purple-500/20',
    textColor: 'text-purple-300',
    borderColor: 'border-purple-500/40',
    glowColor: 'rgba(192, 132, 252, 0.5)',
    iconName: 'CheckSquare',
  },
  done: {
    label: 'Terminé / Livré',
    shortLabel: 'DONE',
    description: 'Mission complétée avec succès et archivée dans le registre.',
    color: '#10b981', // Emerald
    badgeBg: 'bg-emerald-500/20',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/40',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    iconName: 'CheckCircle2',
  },
  error: {
    label: 'Incident détecté',
    shortLabel: 'ERROR',
    description: "Anomalie d'exécution, dépassement de quota ou rejet de validation.",
    color: '#f43f5e', // Rose
    badgeBg: 'bg-rose-500/20',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    iconName: 'AlertTriangle',
  },
  offline: {
    label: 'Hors ligne / Déconnecté',
    shortLabel: 'OFFLINE',
    description: 'Processus suspendu, nœud déconnecté de la matrice centrale.',
    color: '#64748b', // Slate 500
    badgeBg: 'bg-slate-500/15',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500/30',
    glowColor: 'rgba(100, 116, 139, 0.2)',
    iconName: 'WifiOff',
  },
};

export type PoleId = 'tech' | 'carole' | 'contenu' | 'personnel';

export interface Pole {
  id: PoleId;
  name: string;
  codeName: string;
  category: string;
  tagline: string;
  description: string;
  accentColor: string;
  bgGradient: string;
  centerCoords: { x: number; z: number };
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  interiorCameraTarget: [number, number, number];
  interiorCameraPosition: [number, number, number];
  features: string[];
  operationalSector: string;
  activeModules: string[];
}

export interface TaskHistoryItem {
  id: string;
  title: string;
  completedAt: string;
  duration: string;
  status: 'success' | 'failed' | 'aborted';
}

export interface AgentEvent {
  id: string;
  timestamp: string;
  message: string;
  severity: 'info' | 'warn' | 'error' | 'success';
}

export interface Agent {
  id: string;
  systemId: string;
  name: string;
  role: string;
  poleId: PoleId;
  status: AgentState;
  currentTask: string;
  lastActivity: string;
  progress: number; // 0-100
  hairColor: string;
  clothesColor: string;
  characterPosition: [number, number, number];
  rotationY: number;
  project: string;
  dependencies: string[];
  toolsUsed: string[];
  dataSources: string[];
  logStream: string[];
  taskHistory: TaskHistoryItem[];
  recentEvents: AgentEvent[];
  cpuLoad: number; // 0-100%
  networkThroughput: number; // KB/s
  isSimulated: boolean;
}

export interface DataFlowConnection {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  fromDistrictId: PoleId;
  toDistrictId: PoleId;
  payloadType: string;
  missionId: string;
  timestamp: string;
  status: 'active' | 'queued' | 'completed' | 'blocked';
  latencyMs: number;
  curvePoints: [number, number, number][];
}

export interface Project {
  id: string;
  name: string;
  code: string;
  districtId: PoleId;
  description: string;
  health: 'optimal' | 'warning' | 'critical';
  tasksCount: number;
  activeAgents: string[];
  errorCount: number;
  commitHash: string;
  deliverablesCount: number;
}

export type ViewMode = 'spatial' | 'flightradar' | 'github_city';

export type ZoomLevel = 'overworld' | 'district' | 'workspace';

export interface SystemTelemetry {
  status: 'ONLINE' | 'OPTIMAL' | 'DEGRADED';
  activeAgents: number;
  totalAgents: number;
  activeMissions: number;
  systemAlerts: number;
  neuralLatencyMs: number;
  simulatedMode: boolean;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: 'task_created' | 'status_changed' | 'data_transfer' | 'error_detected' | 'review_needed' | 'deploy_completed';
  agentId?: string;
  districtId?: PoleId;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}
