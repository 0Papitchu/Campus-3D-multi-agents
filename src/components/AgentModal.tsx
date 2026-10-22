import React from 'react';
import {
  X,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Info,
} from 'lucide-react';
import {
  AGENT_STATES_CONFIG,
  type Agent,
  type AgentState,
} from '../types/world.ts';
import { POLES, SUGGESTED_TASKS_BY_AGENT } from '../simulation/agentModel.ts';

interface AgentModalProps {
  agent: Agent | null;
  onClose: () => void;
  onUpdateStatus: (agentId: string, newState: AgentState) => void;
  onAssignTask: (agentId: string, taskTitle: string, status?: AgentState) => void;
  onFocusAgent: (agentId: string) => void;
}

const STATE_ICONS: Record<AgentState, React.ReactNode> = {
  idle: <Activity className="w-3.5 h-3.5 text-cyan-400" />,
  working: <Activity className="w-3.5 h-3.5 text-cyan-400" />,
  thinking: <Clock className="w-3.5 h-3.5 text-indigo-400" />,
  waiting: <Clock className="w-3.5 h-3.5 text-amber-400" />,
  review: <AlertCircle className="w-3.5 h-3.5 text-purple-400" />,
  done: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  error: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
  offline: <Clock className="w-3.5 h-3.5 text-slate-400" />,
};

export const AgentModal: React.FC<AgentModalProps> = ({
  agent,
  onClose,
  onUpdateStatus,
  onAssignTask,
  onFocusAgent,
}) => {
  if (!agent) return null;

  const pole = POLES.find((p) => p.id === agent.poleId);
  const stateCfg = AGENT_STATES_CONFIG[agent.status];
  const suggestedTasks = SUGGESTED_TASKS_BY_AGENT[agent.id] || [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-dialog-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 text-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            {/* Avatar Swatch */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-md shrink-0 border border-white/20"
              style={{ backgroundColor: agent.clothesColor }}
            >
              {agent.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="agent-dialog-title"
                  className="text-lg font-bold text-slate-100"
                >
                  {agent.name}
                </h2>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${pole?.accentColor}20`,
                    borderColor: `${pole?.accentColor}50`,
                    color: pole?.accentColor,
                  }}
                >
                  {pole?.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{agent.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onFocusAgent(agent.id)}
              aria-label="Recentrer la caméra 3D sur l'agent"
              title="Centrer la caméra sur l'agent"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Fermer la fiche de l'agent"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current State & Progress */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">État simulé</span>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${stateCfg.badgeBg} ${stateCfg.borderColor} ${stateCfg.textColor}`}
            >
              {STATE_ICONS[agent.status]}
              <span>{stateCfg.label}</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-1 italic">
            "{stateCfg.description}"
          </p>

          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
            <span>Dernière activité simulée :</span>
            <span className="font-medium text-slate-200">{agent.lastActivity}</span>
          </div>
        </div>

        {/* Active Mock Task */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Tâche actuelle en cours (donnée fictive)
          </label>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm font-medium text-slate-100">
            {agent.currentTask}
          </div>

          {/* Progress Bar */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${agent.progress}%`,
                  backgroundColor: stateCfg.color,
                }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400 shrink-0">
              {agent.progress}%
            </span>
          </div>
        </div>

        {/* State Simulator Buttons */}
        <div className="mt-5">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Simuler un changement d'état (Test direct)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(AGENT_STATES_CONFIG) as AgentState[]).map((st) => {
              const cfg = AGENT_STATES_CONFIG[st];
              const isCurrent = agent.status === st;
              return (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(agent.id, st)}
                  aria-label={`Passer à l'état ${cfg.label}`}
                  className={`p-2 rounded-xl text-xs font-medium border text-left transition-all flex items-center gap-2 ${
                    isCurrent
                      ? `${cfg.badgeBg} ${cfg.borderColor} text-white ring-2 ring-white/20`
                      : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="truncate">{cfg.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Tasks Quick Swap */}
        {suggestedTasks.length > 0 && (
          <div className="mt-5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Changer pour une autre tâche suggérée
            </span>
            <div className="space-y-1.5">
              {suggestedTasks.map((task) => (
                <button
                  key={task}
                  onClick={() => onAssignTask(agent.id, task, 'working')}
                  aria-label={`Attribuer la tâche : ${task}`}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:text-sky-300 transition-colors flex items-center justify-between gap-2 group"
                >
                  <span className="truncate">{task}</span>
                  <Send className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-amber-400/80 shrink-0" />
          <span>
            Ce personnage est une représentation visuelle. Aucune véritable IA ou
            agent externe n'est connecté.
          </span>
        </div>
      </div>
    </div>
  );
};
