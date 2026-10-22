import React from 'react';
import {
  ChevronDown,
  ChevronUp,
  Compass,
  Cpu,
  Palette,
  Video,
  UserCheck,
  PlusCircle,
} from 'lucide-react';
import { POLES } from '../simulation/agentModel.ts';
import type { PoleId } from '../types/world.ts';

interface ControlDockProps {
  activePoleId: PoleId | null;
  onSelectPole: (poleId: PoleId) => void;
  onResetCamera: () => void;
  onOpenNewTaskModal: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isSidebarOpen?: boolean;
}

const POLE_ICONS: Record<PoleId, React.ReactNode> = {
  tech: <Cpu className="w-3.5 h-3.5" />,
  carole: <Palette className="w-3.5 h-3.5" />,
  contenu: <Video className="w-3.5 h-3.5" />,
  personnel: <UserCheck className="w-3.5 h-3.5" />,
};

export const ControlDock: React.FC<ControlDockProps> = ({
  activePoleId,
  onSelectPole,
  onResetCamera,
  onOpenNewTaskModal,
  isCollapsed,
  onToggleCollapse,
  isSidebarOpen = false,
}) => {
  return (
    <div
      className={`fixed bottom-3 transition-all duration-300 ease-out z-20 flex flex-col items-center pointer-events-none ${
        isSidebarOpen
          ? 'left-1/2 -translate-x-1/2 lg:left-[calc(50%+7rem)] max-w-[94vw] sm:max-w-xl lg:max-w-2xl'
          : 'left-1/2 -translate-x-1/2 max-w-[94vw] sm:max-w-2xl lg:max-w-3xl'
      } w-full ${
        isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Tab Button */}
      <button
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? 'Afficher les contrôles' : 'Masquer les contrôles'}
        className="pointer-events-auto mb-1.5 px-3 py-1 bg-slate-900/95 border border-slate-700/80 rounded-full text-slate-300 text-[11px] font-medium shadow-md hover:bg-slate-800 transition-colors flex items-center gap-1.5"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
            <span>Afficher la barre de contrôle</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Mode Cinéma / Plein écran</span>
          </>
        )}
      </button>

      {/* Main Consolidated Control Deck */}
      <div className="pointer-events-auto w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl shadow-black/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Navigation View Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 max-w-full">
          {/* Overview button */}
          <button
            onClick={onResetCamera}
            aria-label="Vue d'ensemble du campus"
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              activePoleId === null
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vue d’ensemble</span>
            <span className="sm:hidden">Monde</span>
          </button>

          {/* 4 Poles Pills */}
          {POLES.map((pole) => {
            const isSelected = activePoleId === pole.id;
            return (
              <button
                key={pole.id}
                onClick={() => onSelectPole(pole.id)}
                aria-label={`Visiter le pôle ${pole.name}`}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-slate-100 text-slate-900 font-semibold shadow-md'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: pole.accentColor }}
                />
                {POLE_ICONS[pole.id]}
                <span>{pole.name}</span>
              </button>
            );
          })}
        </div>

        {/* Primary Action Button: Nouvelle Mission */}
        <div className="flex items-center justify-end sm:ml-auto shrink-0">
          <button
            onClick={onOpenNewTaskModal}
            aria-label="Créer une nouvelle mission simulée"
            className="w-full sm:w-auto justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-cyan-100" />
            <span>Nouvelle Mission</span>
          </button>
        </div>
      </div>
    </div>
  );
};
