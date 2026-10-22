import React from 'react';
import {
  X,
  Compass,
  ArrowRight,
  Activity,
  Zap,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react';
import {
  AGENT_STATES_CONFIG,
  type Agent,
  type AgentState,
  type Pole,
} from '../types/world.ts';

interface PoleModalProps {
  pole: Pole | null;
  agents: Agent[];
  onClose: () => void;
  onSelectAgent: (agentId: string) => void;
  onFocusPole: (poleId: Pole['id']) => void;
  onEnterInterior: (poleId: Pole['id']) => void;
}

export const PoleModal: React.FC<PoleModalProps> = ({
  pole,
  agents,
  onClose,
  onSelectAgent,
  onFocusPole,
  onEnterInterior,
}) => {
  if (!pole) return null;

  const poleAgents = agents.filter((a) => a.poleId === pole.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="district-dialog-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70"
    >
      <div className="relative w-full max-w-xl bg-slate-950/95 border border-slate-700/80 rounded-2xl shadow-2xl p-5 text-white max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: pole.accentColor }}
              />
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {pole.codeName}
              </span>
            </div>
            <h2
              id="district-dialog-title"
              className="text-lg sm:text-xl font-bold text-slate-100 font-mono mt-0.5"
            >
              {pole.name}
            </h2>
            <p className="text-xs text-cyan-300 font-mono mt-0.5">{pole.tagline}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onFocusPole(pole.id)}
              aria-label="Recentrer la caméra sur ce pôle"
              title="Vue District"
              className="p-2 text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Fermer la vue du pôle"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {pole.description}
          </p>
        </div>

        {/* Active Modules & Operational Sector */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>SECTEUR OPÉRATIONNEL :</span>
            <span className="text-cyan-400 font-bold">{pole.operationalSector}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {pole.activeModules.map((mod) => (
              <span
                key={mod}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
              >
                {mod}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Zoom Navigation Level Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onFocusPole(pole.id)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Niveau 2 : Vue District</span>
          </button>
          <button
            onClick={() => onEnterInterior(pole.id)}
            className="flex-1 py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Niveau 3 : Entrer dans l'Atelier</span>
          </button>
        </div>

        {/* Assigned Agents */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3 font-mono text-xs">
            <span className="text-slate-300 uppercase font-bold">
              Unités IA Affectées ({poleAgents.length})
            </span>
            <span className="text-slate-500 text-[10px]">Cliquer pour inspecter</span>
          </div>

          <div className="space-y-2">
            {poleAgents.map((ag) => {
              const stateCfg = AGENT_STATES_CONFIG[ag.status] || AGENT_STATES_CONFIG.idle;
              return (
                <button
                  key={ag.id}
                  onClick={() => onSelectAgent(ag.id)}
                  aria-label={`Inspecter l'agent ${ag.name}`}
                  className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow text-white"
                      style={{ backgroundColor: ag.clothesColor }}
                    >
                      {ag.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold font-mono text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                          {ag.name}
                        </span>
                        <span
                          className={`inline-flex items-center text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${stateCfg.badgeBg} ${stateCfg.borderColor} ${stateCfg.textColor}`}
                        >
                          {stateCfg.shortLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {ag.currentTask}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
