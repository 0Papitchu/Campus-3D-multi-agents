import React from 'react';
import {
  X,
  Radio,
  ArrowRight,
  Clock,
  Activity,
  Layers,
  Zap,
} from 'lucide-react';
import type { DataFlowConnection, Agent, Pole } from '../types/world.ts';

interface DataFlowInspectorHUDProps {
  flow: DataFlowConnection | null;
  onClose: () => void;
  agents: Agent[];
  poles: Pole[];
  onSelectAgent: (agentId: string) => void;
}

export const DataFlowInspectorHUD: React.FC<DataFlowInspectorHUDProps> = ({
  flow,
  onClose,
  agents,
  poles,
  onSelectAgent,
}) => {
  if (!flow) return null;

  const fromAgent = agents.find((a) => a.id === flow.fromAgentId);
  const toAgent = agents.find((a) => a.id === flow.toAgentId);
  const fromPole = poles.find((p) => p.id === flow.fromDistrictId);
  const toPole = poles.find((p) => p.id === flow.toDistrictId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flow-inspector-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70"
    >
      <div className="relative w-full max-w-lg bg-slate-950/95 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/40 p-5 text-white max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-300">
                FLIGHTRADAR PIPELINE // {flow.id.toUpperCase()}
              </span>
              <h2
                id="flow-inspector-title"
                className="text-base font-bold text-slate-100 font-mono mt-1"
              >
                {flow.payloadType}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer l'inspecteur de flux"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-0.5">STATUT</span>
            <span
              className={`text-xs font-bold ${
                flow.status === 'active'
                  ? 'text-cyan-400'
                  : flow.status === 'blocked'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {flow.status.toUpperCase()}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-0.5">LATENCE</span>
            <span className="text-xs font-bold text-amber-400">{flow.latencyMs} ms</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-0.5">HORODATAGE</span>
            <span className="text-xs font-bold text-slate-300">{flow.timestamp}</span>
          </div>
        </div>

        {/* Origin ⟶ Destination Nodes */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            NŒUDS DE TRANSMISSION
          </span>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
            {/* Origin */}
            <div className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-0.5">SOURCE</span>
              <strong className="text-cyan-300 block truncate">{fromAgent?.name || flow.fromAgentId}</strong>
              <span className="text-[10px] text-slate-400 block">{fromPole?.name}</span>
            </div>

            <div className="flex items-center justify-center text-amber-400">
              <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
            </div>

            {/* Destination */}
            <div className="flex-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block mb-0.5">DESTINATION</span>
              <strong className="text-purple-300 block truncate">{toAgent?.name || flow.toAgentId}</strong>
              <span className="text-[10px] text-slate-400 block">{toPole?.name}</span>
            </div>
          </div>
        </div>

        {/* Mission Context */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="text-slate-500 block text-[10px]">MISSION ASSOCIÉE</span>
          <span className="text-slate-200 font-bold">{flow.missionId}</span>
          <p className="text-[11px] text-slate-400 mt-1 font-sans">
            Transfert de données asynchrone orchestré par le bus neural multi-agents.
          </p>
        </div>

        {/* Action */}
        <div className="mt-4 flex items-center justify-end gap-2">
          {fromAgent && (
            <button
              onClick={() => {
                onClose();
                onSelectAgent(fromAgent.id);
              }}
              className="py-1.5 px-3 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Inspecter Source ({fromAgent.name})
            </button>
          )}
          {toAgent && (
            <button
              onClick={() => {
                onClose();
                onSelectAgent(toAgent.id);
              }}
              className="py-1.5 px-3 rounded-xl text-xs font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors"
            >
              Inspecter Cible ({toAgent.name})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
