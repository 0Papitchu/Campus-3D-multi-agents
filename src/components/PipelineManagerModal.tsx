import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle2,
  Clock,
  Sparkles,
  FileCode,
  FileText,
  Eye,
  ChevronRight,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import type { MultiAgentPipeline, PipelineStep } from '../types/pipeline.ts';
import type { PoleId } from '../types/world.ts';

interface PipelineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pipelines: MultiAgentPipeline[];
  activePipelineId: string;
  onSelectPipeline: (pipelineId: string) => void;
  onStartPipeline: (pipelineId: string) => void;
  onPausePipeline: (pipelineId: string) => void;
  onAdvanceStep: (pipelineId: string) => void;
  onResetPipeline: (pipelineId: string) => void;
  onFocusAgent?: (agentId: string) => void;
}

const POLE_COLORS: Record<PoleId, { border: string; bg: string; text: string; label: string }> = {
  tech: { border: 'border-sky-400', bg: 'bg-sky-500/20', text: 'text-sky-300', label: 'Tech' },
  carole: { border: 'border-rose-400', bg: 'bg-rose-500/20', text: 'text-rose-300', label: 'Carole' },
  contenu: { border: 'border-purple-400', bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'Média' },
  personnel: { border: 'border-emerald-400', bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Nexus' },
};

export const PipelineManagerModal: React.FC<PipelineManagerModalProps> = ({
  isOpen,
  onClose,
  pipelines,
  activePipelineId,
  onSelectPipeline,
  onStartPipeline,
  onPausePipeline,
  onAdvanceStep,
  onResetPipeline,
  onFocusAgent,
}) => {
  const [inspectedArtifactStep, setInspectedArtifactStep] = useState<PipelineStep | null>(null);

  if (!isOpen) return null;

  const activePipe = pipelines.find((p) => p.id === activePipelineId) || pipelines[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/60 text-slate-100 overflow-hidden ring-1 ring-cyan-500/20">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-md shadow-cyan-500/30">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Orchestrateur de Pipelines Multi-Agents
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  DAG Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exécution séquentielle et transfert de livrables entre agents d&apos;élite
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Selector Tabs */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {pipelines.map((pipe) => {
            const isSelected = pipe.id === activePipelineId;
            return (
              <button
                key={pipe.id}
                onClick={() => {
                  onSelectPipeline(pipe.id);
                  setInspectedArtifactStep(null);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-cyan-600/30 border border-cyan-400 text-cyan-200 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{pipe.name}</span>
                {pipe.status === 'running' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
                {pipe.status === 'completed' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body: DAG Stepper & Artifact Viewer */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {/* Active Pipeline Status Banner */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                {activePipe.category}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">
                {activePipe.name}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {activePipe.description}
              </p>
            </div>

            {/* Overall Progress Gauge */}
            <div className="w-full sm:w-48 shrink-0 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Progression DAG</span>
                <span className="text-cyan-300 font-bold">{Math.round(activePipe.overallProgress)}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${activePipe.overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stepper Chain (DAG Nodes) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>Étapes du Workflow ({activePipe.steps.length} agents impliqués)</span>
              <span>Tokens cumulés : {activePipe.steps.reduce((acc, s) => acc + (s.status === 'completed' ? s.tokensUsed : 0), 0).toLocaleString()}</span>
            </div>

            <div className="space-y-2.5">
              {activePipe.steps.map((step, idx) => {
                const poleStyle = POLE_COLORS[step.poleId] || POLE_COLORS.tech;
                const isCurrent = activePipe.currentStepIndex === idx && activePipe.status === 'running';
                const isCompleted = step.status === 'completed';

                return (
                  <div
                    key={step.id}
                    className={`rounded-2xl p-3.5 border transition-all ${
                      isCurrent
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/40'
                        : isCompleted
                        ? 'bg-slate-950/40 border-emerald-500/30'
                        : 'bg-slate-900/50 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Step Index & Agent Identity */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono shrink-0 border ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : isCurrent
                              ? 'bg-cyan-500 text-slate-950 border-white animate-pulse'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                              {step.title}
                            </h4>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${poleStyle.bg} ${poleStyle.border} ${poleStyle.text}`}
                            >
                              {step.agentName}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                                En exécution
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {step.description}
                          </p>

                          {/* Reasoning Trace snippet if available */}
                          {step.reasoningTrace && isCompleted && (
                            <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-950/80 rounded-lg p-2 border border-slate-800/60">
                              <span className="text-cyan-400 font-semibold block mb-0.5">
                                💡 Raisonnement : {step.reasoningTrace.thought}
                              </span>
                              <span className="text-slate-300">
                                🛠️ {step.reasoningTrace.tool} ➔ {step.reasoningTrace.observation}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Artifact & Focus actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {step.artifact && (
                          <button
                            onClick={() => setInspectedArtifactStep(step)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 transition-colors"
                          >
                            <FileCode className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Livrable</span>
                          </button>
                        )}
                        <button
                          onClick={() => onFocusAgent?.(step.agentId)}
                          title="Localiser l'agent dans la scène"
                          className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inspected Artifact Modal Drawer */}
          {inspectedArtifactStep && inspectedArtifactStep.artifact && (
            <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-mono">
                    Livrable produit : {inspectedArtifactStep.artifact.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({inspectedArtifactStep.artifact.format})
                  </span>
                </div>
                <button
                  onClick={() => setInspectedArtifactStep(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <pre className="bg-slate-900 rounded-xl p-3 text-xs font-mono text-cyan-300 overflow-x-auto max-h-48 border border-slate-800">
                {inspectedArtifactStep.artifact.preview}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Execution Controls */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Statut :</span>
            <span
              className={`font-bold uppercase ${
                activePipe.status === 'running'
                  ? 'text-emerald-400'
                  : activePipe.status === 'completed'
                  ? 'text-cyan-400'
                  : 'text-amber-400'
              }`}
            >
              {activePipe.status === 'running'
                ? 'En cours d’exécution'
                : activePipe.status === 'completed'
                ? 'Pipeline Terminé'
                : 'En attente'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activePipe.status === 'running' ? (
              <button
                onClick={() => onPausePipeline(activePipe.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 border border-amber-400/60 text-amber-200 text-xs font-bold transition-all"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Mettre en pause</span>
              </button>
            ) : (
              <button
                onClick={() => onStartPipeline(activePipe.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Lancer le pipeline</span>
              </button>
            )}

            <button
              onClick={() => onAdvanceStep(activePipe.id)}
              title="Exécuter pas-à-pas l'étape suivante"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <FastForward className="w-3.5 h-3.5 text-cyan-400" />
              <span>Étape suivante</span>
            </button>

            <button
              onClick={() => onResetPipeline(activePipe.id)}
              title="Réinitialiser le pipeline"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
