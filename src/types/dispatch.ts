import type { PoleId } from './world.ts';

export interface CEODispatchedTask {
  id: string;
  poleId: PoleId;
  agentId: string;
  agentName: string;
  poleName: string;
  task: string;
  deliverable: string;
  priority: 'urgent' | 'high' | 'normal';
  status: 'dispatched' | 'in_progress' | 'completed';
}

export interface CEODirectivePreset {
  id: string;
  title: string;
  category: string;
  objective: string;
  badge: string;
  color: string;
  tasks: {
    poleId: PoleId;
    agentId: string;
    task: string;
    deliverable: string;
    priority: 'urgent' | 'high' | 'normal';
  }[];
  matchingPipelineId?: string;
}

export interface CEODispatchRecord {
  id: string;
  timestamp: string;
  directiveTitle: string;
  tasksCount: number;
  polesInvolved: PoleId[];
  status: 'deployed' | 'active' | 'archived';
}
