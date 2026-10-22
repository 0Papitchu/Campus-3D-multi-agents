import React, { useState } from 'react';
import {
  Crown,
  X,
  Send,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Cpu,
  Eye,
  Radio,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import { CEO_DIRECTIVE_PRESETS, decomposeCustomDirective } from '../simulation/ceoPresets.ts';
import type { CEODirectivePreset, CEODispatchedTask } from '../types/dispatch.ts';
import type { Agent, PoleId } from '../types/world.ts';

interface CEODispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  onExecuteDispatch: (directive: CEODirectivePreset, tasks: CEODispatchedTask[]) => void;
  onFocusCEO: () => void;
  isDispatching?: boolean;
}

const POLE_INFO: Record<
  PoleId,
  { label: string; accent: string; border: string; bg: string; text: string; icon: string }
> = {
  tech: {
    label: 'Pôle Tech',
    accent: '#38bdf8',
    border: 'border-sky-500/40',
    bg: 'bg-sky-950/40',
    text: 'text-sky-300',
    icon: '⚡',
  },
  carole: {
    label: 'Maison Carole',
    accent: '#fb7185',
    border: 'border-rose-500/40',
    bg: 'bg-rose-950/40',
    text: 'text-rose-300',
    icon: '✨',
  },
  contenu: {
    label: 'Pôle Contenu',
    accent: '#c084fc',
    border: 'border-purple-500/40',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    icon: '🎬',
  },
  personnel: {
    label: 'Pôle Personnel / Nexus',
    accent: '#34d399',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    icon: '🧭',
  },
};

export const CEODispatchModal: React.FC<CEODispatchModalProps> = ({
  isOpen,
  onClose,
  agents,
  onExecuteDispatch,
  onFocusCEO,
  isDispatching = false,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(CEO_DIRECTIVE_PRESETS[0].id);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [dispatchedTasks, setDispatchedTasks] = useState<CEODispatchedTask[]>(() => {
    return CEO_DIRECTIVE_PRESETS[0].tasks.map((t, idx) => {
      const agent = agents.find((a) => a.id === t.agentId);
      return {
        id: `task-${idx}-${Date.now()}`,
        poleId: t.poleId,
        agentId: t.agentId,
        agentName: agent ? agent.name : t.agentId,
        poleName: POLE_INFO[t.poleId]?.label || t.poleId,
        task: t.task,
        deliverable: t.deliverable,
        priority: t.priority,
        status: 'dispatched' as const,
      };
    });
  });

  const [activePoleToggles, setActivePoleToggles] = useState<Record<PoleId, boolean>>({
    tech: true,
    carole: true,
    contenu: true,
    personnel: true,
  });

  const [dispatchSuccessNotice, setDispatchSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPreset = CEO_DIRECTIVE_PRESETS.find((p) => p.id === selectedPresetId) || CEO_DIRECTIVE_PRESETS[0];

  const handleSelectPreset = (preset: CEODirectivePreset) => {
    setSelectedPresetId(preset.id);
    setIsCustomMode(false);
    setDispatchSuccessNotice(null);

    const newTasks = preset.tasks.map((t, idx) => {
      const agent = agents.find((a) => a.id === t.agentId);
      return {
        id: `task-${preset.id}-${idx}-${Date.now()}`,
        poleId: t.poleId,
        agentId: t.agentId,
        agentName: agent ? agent.name : t.agentId,
        poleName: POLE_INFO[t.poleId]?.label || t.poleId,
        task: t.task,
        deliverable: t.deliverable,
        priority: t.priority,
        status: 'dispatched' as const,
      };
    });
    setDispatchedTasks(newTasks);
  };

  const handleApplyCustomPrompt = () => {
    if (!customPrompt.trim()) return;
    setIsCustomMode(true);
    setDispatchSuccessNotice(null);
    const generatedTasks = decomposeCustomDirective(customPrompt);
    setDispatchedTasks(generatedTasks);
  };

  const handleTaskTextChange = (poleId: PoleId, newText: string) => {
    setDispatchedTasks((prev) =>
      prev.map((t) => (t.poleId === poleId ? { ...t, task: newText } : t))
    );
  };

  const handleTogglePole = (poleId: PoleId) => {
    setActivePoleToggles((prev) => ({
      ...prev,
      poleId: !prev[poleId],
    }));
  };

  const handleExecute = () => {
    const tasksToDeploy = dispatchedTasks.filter((t) => activePoleToggles[t.poleId] !== false);
    if (tasksToDeploy.length === 0) return;

    const directiveToSend: CEODirectivePreset = isCustomMode
      ? {
          id: `custom-directive-${Date.now()}`,
          title: customPrompt.trim().slice(0, 50) || 'Directive Personnalisée',
          category: 'Directive Directe CEO',
          badge: 'Sur-mesure',
          color: '#f59e0b',
          objective: customPrompt.trim(),
          tasks: tasksToDeploy.map((t) => ({
            poleId: t.poleId,
            agentId: t.agentId,
            task: t.task,
            deliverable: t.deliverable,
            priority: t.priority,
          })),
        }
      : currentPreset;

    onExecuteDispatch(directiveToSend, tasksToDeploy);
    setDispatchSuccessNotice(
      `Directive « ${directiveToSend.title} » déployée sur ${tasksToDeploy.length} pôles ! Les agents reçoivent leurs assignations.`
    );

    setTimeout(() => {
      setDispatchSuccessNotice(null);
    }, 4500);
  };

  const activeCount = dispatchedTasks.filter((t) => activePoleToggles[t.poleId] !== false).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/50 overflow-hidden text-slate-100">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/30">
              <Crown className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Aura — Chief Executive Orchestrator
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-300">
                  AGENT-00-CEO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Décomposition stratégique, arbitrage des priorités et dispatching automatisé aux 4 pôles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onFocusCEO}
              title="Voir Aura dans son bureau (Secteur 4)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-800/80 hover:bg-amber-950/70 border border-slate-700 hover:border-amber-500/50 text-amber-200 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bureau CEO</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-amber-500/30">
          {/* Success Banner */}
          {dispatchSuccessNotice && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs sm:text-sm animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-medium">{dispatchSuccessNotice}</span>
            </div>
          )}

          {/* Section 1: Choose Strategic Directive Preset */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-300">
                  1. Sélectionner une Directive Stratégique
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Décomposition multi-agents prête à l&apos;emploi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {CEO_DIRECTIVE_PRESETS.map((preset) => {
                const isSelected = !isCustomMode && selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-200 group relative ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-400 text-white shadow-lg shadow-amber-950/50 scale-[1.02]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-amber-500/40 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-amber-300 border border-amber-500/30">
                        {preset.badge}
                      </span>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    <span className="font-bold text-xs leading-snug line-clamp-2 text-white">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {preset.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Custom Directive Input */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="ceo-custom-prompt"
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-slate-300"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ou Directive Libre / Prompt Exécutif :</span>
              </label>
              {isCustomMode && (
                <span className="text-[11px] font-mono text-amber-300 font-semibold">
                  Mode Directive Personnalisée Actif
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="ceo-custom-prompt"
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyCustomPrompt();
                }}
                placeholder="Ex : Lancer la refonte UI mobile, synchroniser le teaser vidéo et réserver le GPU..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500"
              />
              <button
                onClick={handleApplyCustomPrompt}
                disabled={!customPrompt.trim()}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 disabled:opacity-40 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Décomposer avec l&apos;IA</span>
              </button>
            </div>
          </div>

          {/* Section 3: The 4 Dispatched Tasks Matrix (Live Preview & Edits) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-300">
                  2. Matrice de Dispatching Multi-Pôles ({activeCount}/4 actifs)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Sous-tâches générées et assignées par le CEO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(['tech', 'carole', 'contenu', 'personnel'] as PoleId[]).map((poleId) => {
                const pole = POLE_INFO[poleId];
                const taskItem = dispatchedTasks.find((t) => t.poleId === poleId);
                const isEnabled = activePoleToggles[poleId] !== false;

                if (!taskItem) return null;

                const assignedAgent = agents.find((a) => a.id === taskItem.agentId);

                return (
                  <div
                    key={poleId}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isEnabled
                        ? `${pole.bg} ${pole.border} shadow-sm`
                        : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                    }`}
                  >
                    {/* Pole Header & Toggle */}
                    <div className="flex items-center justify-between mb-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{pole.icon}</span>
                        <div>
                          <span className={`text-xs font-bold ${pole.text}`}>{pole.label}</span>
                          <span className="text-[10px] text-slate-400 block">
                            Assigné à : <strong className="text-slate-200">{assignedAgent?.name || taskItem.agentName}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                            taskItem.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {taskItem.priority}
                        </span>

                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => handleTogglePole(poleId)}
                          title="Activer/Désactiver le dispatch pour ce pôle"
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Task Content (Editable Textarea) */}
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-1">
                          Mission transmise :
                        </label>
                        <textarea
                          rows={2}
                          value={taskItem.task}
                          disabled={!isEnabled}
                          onChange={(e) => handleTaskTextChange(poleId, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-700/80 focus:border-amber-400 text-xs text-slate-100 disabled:opacity-60 focus:outline-none resize-none"
                        />
                      </div>

                      {/* Expected Deliverable Tag */}
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
                        <FileCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-slate-400 shrink-0">Livrable :</span>
                        <span className="truncate text-slate-200 font-medium">
                          {taskItem.deliverable}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              Canal Exécutif : <strong>Aura (CEO)</strong> ➔ <strong>{activeCount} Pôles</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Fermer
            </button>

            <button
              onClick={handleExecute}
              disabled={activeCount === 0 || isDispatching}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>
                {isDispatching ? 'Déploiement en cours...' : `Dispatcher aux Pôles (${activeCount})`}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
