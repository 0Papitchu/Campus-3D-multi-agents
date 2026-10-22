import React from 'react';
import {
  Volume2,
  VolumeX,
  Tags,
  RotateCcw,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface HeaderBarProps {
  isMuted: boolean;
  onToggleSound: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  onResetSimulation: () => void;
  onOpenLegend: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isMuted,
  onToggleSound,
  showLabels,
  onToggleLabels,
  onResetSimulation,
  onOpenLegend,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2.5 sm:p-4 flex items-center justify-between gap-2">
      {/* Brand & Demo Badge */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-slate-900/95 border border-slate-700/80 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-lg shadow-black/20 text-white max-w-[62%] sm:max-w-none">
        <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100 truncate">
              Campus Multi-Agents
            </h1>
            <span className="inline-flex items-center text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 shrink-0">
              DÉMO
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate hidden xs:block">
            Monde virtuel de travail en 3D isométrique
          </p>
        </div>
      </div>

      {/* Header Quick Controls */}
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-slate-900/95 border border-slate-700/80 rounded-xl p-1 sm:p-1.5 shadow-lg shadow-black/20">
        <button
          onClick={onToggleLabels}
          title={showLabels ? 'Masquer les étiquettes' : 'Afficher les étiquettes'}
          aria-label="Basculer l'affichage des étiquettes des pôles"
          className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            showLabels
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Tags className="w-3.5 h-3.5 sm:w-4 h-4" />
          <span className="hidden md:inline">Étiquettes</span>
        </button>

        <button
          onClick={onToggleSound}
          title={isMuted ? 'Activer le son' : 'Désactiver le son'}
          aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          className={`p-1.5 sm:p-2 rounded-lg text-xs font-medium transition-colors ${
            !isMuted
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 h-4" />}
        </button>

        <button
          onClick={onResetSimulation}
          title="Réinitialiser la simulation à l'état initial"
          aria-label="Réinitialiser la simulation"
          className="p-1.5 sm:p-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 h-4" />
          <span className="hidden lg:inline">Réinitialiser</span>
        </button>

        <button
          onClick={onOpenLegend}
          title="Légende des états et des pôles"
          aria-label="Ouvrir la légende des états"
          className="p-1.5 sm:p-2 rounded-lg text-xs font-medium bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 hover:bg-indigo-600/50 transition-colors flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 h-4 text-indigo-300" />
          <span className="hidden sm:inline">Légende</span>
        </button>
      </div>
    </header>
  );
};
