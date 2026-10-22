import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Sparkles,
  Zap,
  Info,
  ShieldAlert,
  Code2,
} from 'lucide-react';
import {
  AGENT_STATES_CONFIG,
  type Agent,
  type AgentState,
  type Project,
  type Pole,
} from '../types/world.ts';
import { SUGGESTED_TASKS_BY_AGENT } from '../simulation/agentModel.ts';

interface MissionLaunchModalProps {
  isOpen: boolean;
  agents: Agent[];
  projects: Project[];
  poles: Pole[];
  defaultAgentId?: string;
  onClose: () => void;
  onLaunchMission: (
    agentId: string,
    missionTitle: string,
    project: string,
    priority: 'standard' | 'high' | 'critical',
    initialState: AgentState
  ) => void;
}

export const MissionLaunchModal: React.FC<MissionLaunchModalProps> = ({
  isOpen,
  agents,
  projects,
  poles,
  defaultAgentId,
  onClose,
  onLaunchMission,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    defaultAgentId || agents[0]?.id || ''
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.name || ''
  );
  const [missionTitle, setMissionTitle] = useState<string>('');
  const [priority, setPriority] = useState<'standard' | 'high' | 'critical'>('high');
  const [initialStatus, setInitialStatus] = useState<AgentState>('working');
  const [constraints, setConstraints] = useState<string>('Max tokens: 4096, Latency SLA: 50ms');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentAgent = agents.find((a) => a.id === selectedAgentId);
  const suggestedTasks = currentAgent ? SUGGESTED_TASKS_BY_AGENT[currentAgent.id] || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionTitle.trim()) {
      setErrorMsg('Veuillez spécifier l’objectif de la mission.');
      return;
    }
    setErrorMsg('');
    onLaunchMission(selectedAgentId, missionTitle.trim(), selectedProjectId, priority, initialStatus);
    setMissionTitle('');
    onClose();
  };

  const handlePickSuggestion = (title: string) => {
    setMissionTitle(title);
    setErrorMsg('');
  };

  // Live JSON dispatch preview
  const jsonPreview = {
    protocol: 'MONDE_ATELIER_DISPATCH_v4',
    targetAgent: currentAgent?.systemId || selectedAgentId,
    project: selectedProjectId,
    priority: priority.toUpperCase(),
    task: missionTitle || '...',
    constraints,
    simulated: true,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mission-launch-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75"
    >
      <div className="relative w-full max-w-2xl bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/40 p-5 sm:p-6 text-white max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg ring-1 ring-cyan-400/40">
              <Zap className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
                CONSOLE DE DISPATCH TACTIQUE // RICK & TONY LAB
              </span>
              <h2
                id="mission-launch-title"
                className="text-base sm:text-lg font-bold text-slate-100 font-mono"
              >
                Lancer une Nouvelle Mission
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer la console de mission"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Agent Selector */}
            <div>
              <label
                htmlFor="mission-agent-select"
                className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Agent / Unité Assignée
              </label>
              <select
                id="mission-agent-select"
                value={selectedAgentId}
                onChange={(e) => {
                  setSelectedAgentId(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {poles.map((pole) => (
                  <optgroup key={pole.id} label={pole.name}>
                    {agents
                      .filter((a) => a.poleId === pole.id)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.systemId})
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Project Selector */}
            <div>
              <label
                htmlFor="mission-project-select"
                className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Projet Associé (District)
              </label>
              <select
                id="mission-project-select"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.name}>
                    {proj.name} ({proj.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Suggested Quick Chips */}
          {suggestedTasks.length > 0 && (
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                Objectifs prédéfinis pour {currentAgent?.name} :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedTasks.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handlePickSuggestion(sug)}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 text-slate-300 transition-colors text-left"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mission Objective Input */}
          <div>
            <label
              htmlFor="mission-goal-input"
              className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Description de la Mission / Objectif
            </label>
            <input
              id="mission-goal-input"
              type="text"
              placeholder="Ex: Optimiser les pipelines de rendu et compiler les shaders..."
              value={missionTitle}
              onChange={(e) => {
                setMissionTitle(e.target.value);
                if (e.target.value.trim()) setErrorMsg('');
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            {errorMsg && <p className="text-xs text-rose-400 mt-1 font-mono">{errorMsg}</p>}
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Niveau de Priorité
              </label>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                {(['standard', 'high', 'critical'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-lg border text-center uppercase font-bold transition-all ${
                      priority === p
                        ? p === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                          : p === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                État Initial
              </label>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                {(['working', 'thinking', 'waiting'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setInitialStatus(st)}
                    className={`flex-1 py-1.5 rounded-lg border text-center uppercase font-bold transition-all ${
                      initialStatus === st
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live JSON Dispatch Preview */}
          <div className="p-3 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-cyan-400">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>PRÉVISUALISATION PAYLOAD JSON DISPATCH</span>
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <pre className="overflow-x-auto text-slate-300">
              {JSON.stringify(jsonPreview, null, 2)}
            </pre>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono text-amber-300/80">
              * Simulation locale — affichage instantané dans le monde 3D
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all active:scale-95 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-cyan-200" />
                <span>Lancer la Mission</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
