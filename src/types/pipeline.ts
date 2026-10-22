import type { PoleId } from './world.ts';

export type PipelineStepStatus = 'pending' | 'running' | 'completed' | 'review_required' | 'failed';

export interface StepArtifact {
  type: 'code' | 'benchmark' | 'design_spec' | 'script' | 'deployment' | 'audit';
  title: string;
  preview: string;
  format: string;
}

export interface PipelineStep {
  id: string;
  agentId: string;
  agentName: string;
  poleId: PoleId;
  title: string;
  description: string;
  status: PipelineStepStatus;
  artifact?: StepArtifact;
  latencyMs: number;
  tokensUsed: number;
  startedAt?: string;
  finishedAt?: string;
  reasoningTrace?: {
    thought: string;
    tool: string;
    observation: string;
  };
}

export interface MultiAgentPipeline {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'idle' | 'running' | 'paused' | 'completed';
  currentStepIndex: number;
  steps: PipelineStep[];
  overallProgress: number; // 0-100%
  totalTokens: number;
  totalTimeSec: number;
}

export type AutonomyMode = 'full_autonomous' | 'human_in_the_loop' | 'supervised';

export interface EcosystemConnector {
  id: string;
  name: string;
  type: 'github' | 'figma' | 'slack' | 'rss' | 'webhook';
  endpoint: string;
  status: 'active' | 'paused' | 'synced';
  lastSync: string;
  eventsProcessed: number;
}

export interface EcosystemSettings {
  autonomyMode: AutonomyMode;
  requireApprovalOnDelivery: boolean;
  cpuAlertThreshold: number; // e.g. 80%
  enforceRestPeriods: boolean;
  dailyTokenQuota: number; // e.g. 250000
  retryPolicy: 'auto_retry_pro' | 'reassign_peer' | 'halt_on_error';
  connectors: EcosystemConnector[];
  logRetentionDays: number;
}

export interface AgentOpsTrace {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  poleId: PoleId;
  pipelineName: string;
  stepTitle: string;
  thought: string;
  toolUsed: string;
  observation: string;
  tokens: number;
  durationMs: number;
  status: 'success' | 'warn' | 'error';
}

export interface AgentOpsMetrics {
  totalTokensConsumed: number;
  estimatedCostUsd: number;
  completedPipelinesCount: number;
  activePipelinesCount: number;
  averageLatencyMs: number;
  poleTokenShare: Record<PoleId, number>;
  collaborationMatrix: {
    fromPole: PoleId;
    toPole: PoleId;
    flowsCount: number;
  }[];
}
