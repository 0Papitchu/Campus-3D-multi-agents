import React, { useState } from 'react';
import {
  X,
  Activity,
  Cpu,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  DollarSign,
  Zap,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import type { AgentOpsTrace, AgentOpsMetrics } from '../types/pipeline.ts';
import type { PoleId } from '../types/world.ts';

interface AgentOpsConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: AgentOpsMetrics;
  traces: AgentOpsTrace[];
  onSelectAgent?: (agentId: string) => void;
}

const POLE_INFO: Record<PoleId, { border: string; bg: string; text: string; label: string; accent: string }> = {
  tech: { border: 'border-sky-400', bg: 'bg-sky-500/20', text: 'text-sky-300', label: 'Tech', accent: '#38bdf8' },
  carole: { border: 'border-rose-400', bg: 'bg-rose-500/20', text: 'text-rose-300', label: 'Carole', accent: '#fb7185' },
  contenu: { border: 'border-purple-400', bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'Média', accent: '#c084fc' },
  personnel: { border: 'border-emerald-400', bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Nexus', accent: '#34d399' },
};

export const AgentOpsConsoleModal: React.FC<AgentOpsConsoleModalProps> = ({
  isOpen,
  onClose,
  metrics,
  traces,
  onSelectAgent,
}) => {
  const [filterPole, setFilterPole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTraces = traces.filter((t) => {
    if (filterPole !== 'all' && t.poleId !== filterPole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.agentName.toLowerCase().includes(q) ||
        t.stepTitle.toLowerCase().includes(q) ||
        t.thought.toLowerCase().includes(q) ||
        t.toolUsed.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/60 text-slate-100 overflow-hidden ring-1 ring-cyan-500/20">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-md shadow-purple-500/30">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Console d&apos;Observabilité AgentOps
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300">
                  Telemetry & Traces
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Suivi des tokens, latences d&apos;inférence, matrices de collaboration et raisonnements LLM
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>Tokens Consommés</span>
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {metrics.totalTokensConsumed.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400 block">+14.2k aujourd&apos;hui</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>Coût Estimé</span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-white">
                ${metrics.estimatedCostUsd}
              </div>
              <span className="text-[10px] text-slate-400 block">Sur base API Pro</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>Pipelines Livrés</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {metrics.completedPipelinesCount} terminés
              </div>
              <span className="text-[10px] text-cyan-400 block">{metrics.activePipelinesCount} en cours</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>Latence Moyenne</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {metrics.averageLatencyMs} ms
              </div>
              <span className="text-[10px] text-emerald-400 block">Inférieur au seuil</span>
            </div>
          </div>

          {/* Collaboration Matrix & Token Share */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pole Token Consumption Share */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-white block">
                Répartition des Tokens par Pôle
              </span>
              <div className="space-y-2 text-xs font-mono">
                {(['tech', 'carole', 'contenu', 'personnel'] as PoleId[]).map((pid) => {
                  const p = POLE_INFO[pid];
                  const share = metrics.poleTokenShare[pid] || 25000;
                  const total = metrics.totalTokensConsumed || 100000;
                  const pct = Math.round((share / total) * 100);

                  return (
                    <div key={pid} className="space-y-1">
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span className="font-semibold">{p.label}</span>
                        <span className={p.text}>{share.toLocaleString()} tokens ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: p.accent }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cross-Pole Synergy Matrix */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-white block">
                Matrice d&apos;Échanges Inter-Pôles (Flux de Données)
              </span>
              <div className="space-y-2 text-xs font-mono">
                {metrics.collaborationMatrix.map((collab, i) => {
                  const fromP = POLE_INFO[collab.fromPole];
                  const toP = POLE_INFO[collab.toPole];

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 rounded border font-bold ${fromP.bg} ${fromP.border} ${fromP.text}`}>
                          {fromP.label}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className={`px-1.5 py-0.2 rounded border font-bold ${toP.bg} ${toP.border} ${toP.text}`}>
                          {toP.label}
                        </span>
                      </div>
                      <span className="text-slate-300 font-bold">{collab.flowsCount} transferts</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reasoning & Execution Traces Log */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  Traces d&apos;Exécution & Arbres de Raisonnement ({filteredTraces.length})
                </span>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer traces..."
                    className="bg-slate-900 border border-slate-800 rounded-xl pl-7 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-44"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFilterPole('all')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono ${
                      filterPole === 'all'
                        ? 'bg-slate-200 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Tous
                  </button>
                  {(['tech', 'carole', 'contenu', 'personnel'] as PoleId[]).map((pid) => (
                    <button
                      key={pid}
                      onClick={() => setFilterPole(pid)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border ${
                        filterPole === pid
                          ? `${POLE_INFO[pid].bg} ${POLE_INFO[pid].border} ${POLE_INFO[pid].text} font-bold`
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {POLE_INFO[pid].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Traces List */}
            <div className="space-y-2">
              {filteredTraces.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                  Aucune trace ne correspond aux filtres
                </div>
              ) : (
                filteredTraces.map((trace) => {
                  const poleStyle = POLE_INFO[trace.poleId];
                  const isExpanded = expandedTraceId === trace.id;

                  return (
                    <div
                      key={trace.id}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition-all text-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-slate-400 text-[10px]">
                              {trace.timestamp}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${poleStyle.bg} ${poleStyle.border} ${poleStyle.text}`}
                            >
                              {trace.agentName}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-300 font-medium">
                              {trace.pipelineName}
                            </span>
                          </div>

                          <div className="text-xs text-white font-semibold mt-1">
                            {trace.stepTitle}
                          </div>

                          <p className="text-[11px] text-slate-300 font-mono mt-0.5 line-clamp-1">
                            💡 {trace.thought}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                          <span className="text-slate-400">{trace.tokens} tokens</span>
                          <span className="text-emerald-400">{trace.durationMs}ms</span>
                          <button
                            onClick={() => setExpandedTraceId(isExpanded ? null : trace.id)}
                            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                          >
                            {isExpanded ? 'Fermer' : 'Détails'}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Reasoning Trace Details */}
                      {isExpanded && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2 font-mono text-[11px] animate-in fade-in">
                          <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800 space-y-1.5">
                            <div>
                              <span className="text-cyan-400 font-bold block mb-0.5">
                                [PENSÉE DU MODÈLE]
                              </span>
                              <p className="text-slate-200">{trace.thought}</p>
                            </div>

                            <div>
                              <span className="text-purple-400 font-bold block mb-0.5">
                                [OUTIL INVOQUÉ]
                              </span>
                              <code className="text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block">
                                {trace.toolUsed}
                              </code>
                            </div>

                            <div>
                              <span className="text-emerald-400 font-bold block mb-0.5">
                                [OBSERVATION DU SYSTÈME]
                              </span>
                              <p className="text-slate-300">{trace.observation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs font-mono text-slate-400">
            Telemetry export : JSON / OpenTelemetry compatible
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Fermer la console
          </button>
        </div>
      </div>
    </div>
  );
};
