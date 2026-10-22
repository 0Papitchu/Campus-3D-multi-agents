import React from 'react';
import {
  Gamepad2,
  Eye,
  Activity,
  Cpu,
  Radio,
  Clock,
  Terminal,
  FileText,
  AlertTriangle,
  Play,
  Pause,
  Send,
  Info,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  AGENT_STATES_CONFIG,
  type Agent,
  type AgentState,
} from '../types/world.ts';
import { POLES, SUGGESTED_TASKS_BY_AGENT } from '../simulation/agentModel.ts';
import { FloatingWorkspaceHub } from './FloatingWorkspaceHub.tsx';

interface AgentInspectorHUDProps {
  agent: Agent | null;
  onClose: () => void;
  onUpdateStatus: (agentId: string, newState: AgentState) => void;
  onAssignTask: (agentId: string, taskTitle: string, status?: AgentState) => void;
  onFocusAgent: (agentId: string) => void;
  onOpenNewMission: (defaultAgentId: string) => void;
  onEnterFPS?: (agentId: string) => void;
}

export const AgentInspectorHUD: React.FC<AgentInspectorHUDProps> = ({
  agent,
  onClose,
  onUpdateStatus,
  onAssignTask,
  onFocusAgent,
  onOpenNewMission,
  onEnterFPS,
}) => {
  if (!agent) return null;

  const pole = POLES.find((p) => p.id === agent.poleId);
  const stateCfg = AGENT_STATES_CONFIG[agent.status] || AGENT_STATES_CONFIG.idle;
  const suggestedTasks = SUGGESTED_TASKS_BY_AGENT[agent.id] || [];

  return (
    <FloatingWorkspaceHub
      isOpen={Boolean(agent)}
      onClose={onClose}
      title={agent.name}
      subtitle={agent.role}
      badgeText={agent.systemId}
      badgeColor={pole?.accentColor || '#00f0ff'}
      avatarColor={agent.clothesColor}
      avatarInitials={agent.name.substring(0, 2).toUpperCase()}
      status={agent.status}
      onEnterFPS={onEnterFPS ? () => onEnterFPS(agent.id) : undefined}
    >
      {/* Primary Action Hero: FPS Mode Quick Switch & Focus */}
      <div className="flex items-center gap-2 pb-1">
        {onEnterFPS && (
          <button
            onClick={() => onEnterFPS(agent.id)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition-all hover:scale-[1.02]"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>INCARNER EN MODE FPS</span>
          </button>
        )}

        <button
          onClick={() => onFocusAgent(agent.id)}
          aria-label="Recentrer la caméra sur l'agent"
          title="Recentrer la caméra 3D sur cet agent"
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Live Telemetry Gauges */}
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 block mb-0.5">CHARGE CPU</span>
          <span className="text-sm font-bold text-cyan-400">{agent.cpuLoad}%</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 block mb-0.5">DÉBIT RÉSEAU</span>
          <span className="text-sm font-bold text-indigo-400">{agent.networkThroughput} KB/s</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 block mb-0.5">ACTIVITÉ</span>
          <span className="text-xs font-bold text-slate-300 truncate block">{agent.lastActivity}</span>
        </div>
      </div>

      {/* Operational Status */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400 font-mono">ÉTAT OPÉRATIONNEL</span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${stateCfg.badgeBg} ${stateCfg.borderColor} ${stateCfg.textColor}`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stateCfg.color }} />
            <span>
              {stateCfg.shortLabel} — {stateCfg.label}
            </span>
          </span>
        </div>
        <p className="text-xs text-slate-300 italic mt-1 font-sans">"{stateCfg.description}"</p>
      </div>

      {/* Active Mission & Progress */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="text-slate-400 uppercase tracking-wider">Mission actuelle</span>
          <span className="text-cyan-400 font-bold">{agent.progress}%</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 font-sans">
          {agent.currentTask}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${agent.progress}%`, backgroundColor: stateCfg.color }}
          />
        </div>

        {/* Dependencies & Project */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono text-slate-400">
          <span>
            PROJET : <strong className="text-slate-200">{agent.project}</strong>
          </span>
          <span>
            DÉPENDANCES : <strong className="text-slate-200">{agent.dependencies.join(', ')}</strong>
          </span>
        </div>
      </div>

      {/* Terminal Live Log Stream */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>FLUX DE LOGS & TÉLÉMESURE NEURALE</span>
        </div>
        <div className="p-3 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1 max-h-32 overflow-y-auto">
          {agent.logStream.map((log, i) => (
            <p
              key={i}
              className={
                log.includes('[ERROR]') || log.includes('[FATAL]')
                  ? 'text-rose-400'
                  : log.includes('[SUCCESS]') || log.includes('[OK]')
                  ? 'text-emerald-400'
                  : log.includes('[REVIEW]')
                  ? 'text-purple-300'
                  : 'text-slate-400'
              }
            >
              {log}
            </p>
          ))}
        </div>
      </div>

      {/* Change State (7-State Direct Simulator) */}
      <div>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
          Modifier l'état opérationnel
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-xs">
          {(Object.keys(AGENT_STATES_CONFIG) as AgentState[]).map((st) => {
            const cfg = AGENT_STATES_CONFIG[st];
            const isCurrent = agent.status === st;
            return (
              <button
                key={st}
                onClick={() => onUpdateStatus(agent.id, st)}
                aria-label={`Passer à l'état ${cfg.label}`}
                className={`p-2 rounded-xl text-left border transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? `${cfg.badgeBg} ${cfg.borderColor} text-white font-bold ring-1 ring-white/30`
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                <span className="truncate">{cfg.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Task Suggestions */}
      {suggestedTasks.length > 0 && (
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
            Tâches recommandées
          </span>
          <div className="space-y-1">
            {suggestedTasks.map((task) => (
              <button
                key={task}
                onClick={() => onAssignTask(agent.id, task, 'working')}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-between gap-2 group"
              >
                <span className="truncate">{task}</span>
                <Send className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
          <span>Poste de travail dans l'Immeuble de Bureaux</span>
        </div>

        <button
          onClick={() => {
            onClose();
            onOpenNewMission(agent.id);
          }}
          className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5"
        >
          <span>Nouvelle Mission</span>
        </button>
      </div>
    </FloatingWorkspaceHub>
  );
};
