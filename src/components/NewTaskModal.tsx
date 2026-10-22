import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  AGENT_STATES_CONFIG,
  type Agent,
  type AgentState,
} from '../types/world.ts';
import { POLES, SUGGESTED_TASKS_BY_AGENT } from '../simulation/agentModel.ts';

interface NewTaskModalProps {
  isOpen: boolean;
  agents: Agent[];
  defaultAgentId?: string;
  onClose: () => void;
  onSubmit: (agentId: string, taskTitle: string, status: AgentState) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  agents,
  defaultAgentId,
  onClose,
  onSubmit,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    defaultAgentId || agents[0]?.id || ''
  );
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [status, setStatus] = useState<AgentState>('working');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentAgent = agents.find((a) => a.id === selectedAgentId);
  const currentPole = POLES.find((p) => p.id === currentAgent?.poleId);
  const suggestedTasks = currentAgent
    ? SUGGESTED_TASKS_BY_AGENT[currentAgent.id] || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setErrorMsg('Veuillez saisir un intitulé de tâche fictive.');
      return;
    }
    setErrorMsg('');
    onSubmit(selectedAgentId, taskTitle.trim(), status);
    setTaskTitle('');
    onClose();
  };

  const handlePickSuggestion = (title: string) => {
    setTaskTitle(title);
    setErrorMsg('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-task-dialog-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 text-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="new-task-dialog-title"
                className="text-base sm:text-lg font-bold text-slate-100"
              >
                Nouvelle tâche (Démonstration)
              </h2>
              <p className="text-xs text-slate-400">
                Attribuez une tâche fictive pour animer la simulation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer la fenêtre de nouvelle tâche"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Agent Picker */}
          <div>
            <label
              htmlFor="agent-select"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Agent destinataire
            </label>
            <select
              id="agent-select"
              value={selectedAgentId}
              onChange={(e) => {
                setSelectedAgentId(e.target.value);
                setTaskTitle('');
                setErrorMsg('');
              }}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {POLES.map((pole) => (
                <optgroup key={pole.id} label={pole.name}>
                  {agents
                    .filter((a) => a.poleId === pole.id)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.role}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Quick Suggestions Chips */}
          {suggestedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Exemples suggérés pour {currentAgent?.name} :</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedTasks.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handlePickSuggestion(sug)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 hover:border-sky-500/40 border border-slate-700/80 text-slate-300 transition-colors text-left"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Task Title Input */}
          <div>
            <label
              htmlFor="task-title-input"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Description de la tâche
            </label>
            <input
              id="task-title-input"
              type="text"
              placeholder="Ex: Préparer la maquette du projet..."
              value={taskTitle}
              onChange={(e) => {
                setTaskTitle(e.target.value);
                if (e.target.value.trim()) setErrorMsg('');
              }}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errorMsg}</p>
            )}
          </div>

          {/* Initial State Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              État initial simulé
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(AGENT_STATES_CONFIG) as AgentState[]).map((st) => {
                const cfg = AGENT_STATES_CONFIG[st];
                const isSelected = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`p-2 rounded-xl text-xs font-medium border text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? `${cfg.badgeBg} ${cfg.borderColor} text-white ring-2 ring-white/20`
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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

          {/* Fictional Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Données fictives :</strong> Cette action met à jour le
              modèle 3D et les listes locales. Aucun service extérieur ou vrai
              agent n’est sollicité.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 transition-all"
            >
              Ajouter la tâche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
