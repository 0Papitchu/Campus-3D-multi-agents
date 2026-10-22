import React from 'react';
import {
  X,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Cpu,
  Palette,
  Video,
  UserCheck,
  Power,
  CheckSquare,
  WifiOff,
  Radio,
  Building2,
  Compass,
} from 'lucide-react';
import { AGENT_STATES_CONFIG, type AgentState } from '../types/world.ts';
import { POLES } from '../simulation/agentModel.ts';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATE_ICONS: Record<AgentState, React.ReactNode> = {
  idle: <Power className="w-4 h-4 text-cyan-400" />,
  working: <Activity className="w-4 h-4 text-cyan-300" />,
  thinking: <Cpu className="w-4 h-4 text-indigo-400" />,
  waiting: <Clock className="w-4 h-4 text-amber-400" />,
  review: <CheckSquare className="w-4 h-4 text-purple-400" />,
  done: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  error: <AlertTriangle className="w-4 h-4 text-rose-400" />,
  offline: <WifiOff className="w-4 h-4 text-slate-500" />,
};

const POLE_ICONS: Record<string, React.ReactNode> = {
  tech: <Cpu className="w-4 h-4 text-sky-400" />,
  carole: <Palette className="w-4 h-4 text-rose-400" />,
  contenu: <Video className="w-4 h-4 text-purple-400" />,
  personnel: <UserCheck className="w-4 h-4 text-emerald-400" />,
};

export const LegendModal: React.FC<LegendModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legend-dialog-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70"
    >
      <div className="relative w-full max-w-2xl bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl p-5 sm:p-6 text-white max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
                SYSTÈME DE COMMANDEMENT // GUIDE OPÉRATIONNEL
              </span>
              <h2
                id="legend-dialog-title"
                className="text-base sm:text-lg font-bold text-slate-100 font-mono"
              >
                Légende des États & Modes de Visualisation
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer la légende"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Visual Modes */}
        <div className="mt-4">
          <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Les 3 Modes de Visualisation Spatiale
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Compass className="w-4 h-4" />
                <span>3D SPATIAL</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Exploration libre à 360°, zoom multi-niveaux (Overworld, District, Intérieur) et sélection d'agents.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Radio className="w-4 h-4" />
                <span>FLIGHTRADAR</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Courbes de flux de données en 3D avec paquets lumineux en temps réel entre les agents et pôles.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                <Building2 className="w-4 h-4" />
                <span>GITHUB CITY</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Monolithes et gratte-ciels de code reflétant le volume de tâches, les commits et la santé des projets.
              </p>
            </div>
          </div>
        </div>

        {/* 7 Operational States */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Les 7 États Opérationnels des Agents IA
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(AGENT_STATES_CONFIG) as AgentState[]).map((st) => {
              const cfg = AGENT_STATES_CONFIG[st];
              return (
                <div
                  key={st}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5"
                >
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {STATE_ICONS[st]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-slate-100">
                        {cfg.shortLabel}
                      </span>
                      <span className="text-[10px] text-slate-400">({cfg.label})</span>
                      <span
                        className="w-2 h-2 rounded-full ml-auto"
                        style={{ backgroundColor: cfg.color }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                      {cfg.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Raccourcis Clavier */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Raccourcis Clavier
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-400">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300">/</strong> : Recherche globale
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300">H</strong> : Mode Cinéma (Dock)
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300">C</strong> : Ouvrir Copilote
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300">Échap</strong> : Fermer les fenêtres
            </div>
          </div>
        </div>

        {/* Provenance Notice */}
        <div className="mt-5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 font-sans">
          <p className="font-semibold text-cyan-100 mb-0.5">
            Architecture & Données du prototype :
          </p>
          <p className="text-[11px] text-cyan-300/80 leading-relaxed">
            Ce prototype est conçu comme un centre de commandement spatial interactif. Il utilise une couche de données locale déterministe découplée du moteur de rendu Three.js, prête à recevoir des flux temps réel (WebSockets, API d'orchestration ou agents externes).
          </p>
        </div>
      </div>
    </div>
  );
};
