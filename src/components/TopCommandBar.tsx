import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  FastForward,
  Compass,
  Building,
  Volume2,
  VolumeX,
  HelpCircle,
  X,
  Pin,
  PinOff,
  Eye,
  ChevronDown,
  Sparkles,
  Layers,
  Activity,
  Sliders,
  Crown,
} from 'lucide-react';
import type { ViewMode, SystemTelemetry } from '../types/world.ts';

interface TopCommandBarProps {
  telemetry?: SystemTelemetry;
  systemTelemetry?: SystemTelemetry;
  viewMode?: ViewMode;
  onSetViewMode?: (mode: ViewMode) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
  onToggleMute?: () => void;
  showLabels?: boolean;
  onToggleLabels?: () => void;
  onResetView?: () => void;
  simSpeed?: number;
  onSetSimSpeed?: (speed: number) => void;
  onSetIsometricView?: () => void;
  followedAgentName?: string | null;
  onStopFollow?: () => void;
  onOpenPipelines?: () => void;
  isPipelineRunning?: boolean;
  onOpenSettings?: () => void;
  onOpenAgentOps?: () => void;
  onOpenCEODispatch?: () => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = (props) => {
  const {
    isMuted = false,
    onToggleSound,
    onToggleMute,
    onResetView,
    simSpeed = 1,
    onSetSimSpeed,
    onSetIsometricView,
    followedAgentName,
    onStopFollow,
    onOpenPipelines,
    isPipelineRunning = false,
    onOpenSettings,
    onOpenAgentOps,
    onOpenCEODispatch,
  } = props;

  const handleMute = onToggleMute || onToggleSound || (() => {});

  // Live in-game Clock simulation (The Sims clock)
  const [gameMinutes, setGameMinutes] = useState<number>(9 * 60 + 30); // 09:30 AM
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const restingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // In-game clock tick
  useEffect(() => {
    if (simSpeed === 0) return;
    const interval = setInterval(() => {
      setGameMinutes((prev) => (prev + (1 * simSpeed)) % (24 * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [simSpeed]);

  // Auto-hide inactivity timer (user preference: "Barre flottante minimale avec masquage automatique au repos")
  useEffect(() => {
    if (isPinned) {
      setIsResting(false);
      return;
    }

    const resetTimer = () => {
      setIsResting(false);
      if (restingTimeoutRef.current) {
        clearTimeout(restingTimeoutRef.current);
      }
      restingTimeoutRef.current = setTimeout(() => {
        setIsResting(true);
      }, 3500);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    restingTimeoutRef.current = setTimeout(() => {
      setIsResting(true);
    }, 3500);

    return () => {
      if (restingTimeoutRef.current) {
        clearTimeout(restingTimeoutRef.current);
      }
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [isPinned]);

  const hours = Math.floor(gameMinutes / 60);
  const minutes = Math.floor(gameMinutes % 60);
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const dayName = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'][Math.floor(gameMinutes / 288) % 5];

  // Minimal resting state when inactive and not hovered
  const isMinimal = isResting && !isHovered && !isPinned;

  return (
    <>
      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all duration-300 ease-out max-w-[96vw]"
      >
        {isMinimal ? (
          /* Sleek Minimal Floating Pill (At Rest) */
          <button
            onClick={() => {
              setIsResting(false);
              setIsHovered(true);
            }}
            title="Cliquez pour afficher les commandes complètes"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 text-slate-200 shadow-lg shadow-black/40 hover:shadow-cyan-950/50 transition-all cursor-pointer group"
          >
            <div className="w-2.5 h-2.5 bg-emerald-400 rotate-45 border border-white shadow-sm shadow-emerald-400/80 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-xs font-bold text-amber-300">{timeFormatted}</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{dayName}</span>

            {followedAgentName ? (
              <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 rounded-full px-2 py-0.5">
                🎥 {followedAgentName}
              </span>
            ) : (
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  simSpeed === 0
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : simSpeed === 2
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {simSpeed === 0 ? 'PAUSE' : `${simSpeed}x`}
              </span>
            )}

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
          </button>
        ) : (
          /* Full Unified Floating Glass Bar */
          <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/35 shadow-2xl shadow-cyan-950/40 ring-1 ring-cyan-500/20 text-slate-100 transition-all">
            {/* Logo & Clock */}
            <div className="flex items-center gap-2 sm:gap-2.5 pr-2 sm:pr-3 border-r border-slate-800 shrink-0">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/40 ring-1 ring-white/30">
                <div className="w-2.5 h-2.5 bg-white rotate-45" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wider font-mono text-cyan-300">WORK SIMS</span>
                  <span className="text-[8px] font-bold tracking-widest uppercase px-1 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    3D
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono">
                  <span className="text-amber-300 font-bold">{timeFormatted}</span>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="text-slate-400 hidden sm:inline">{dayName}</span>
                </div>
              </div>
            </div>

            {/* In-Game Speed Controls */}
            <div className="flex items-center gap-1 bg-slate-900/80 rounded-xl p-0.5 border border-slate-800">
              <button
                onClick={() => onSetSimSpeed?.(0)}
                title="Pause"
                className={`p-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                  simSpeed === 0
                    ? 'bg-rose-500/30 border border-rose-400/80 text-rose-300 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[10px]">Pause</span>
              </button>

              <button
                onClick={() => onSetSimSpeed?.(1)}
                title="Vitesse normale (1x)"
                className={`p-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                  simSpeed === 1
                    ? 'bg-emerald-500/30 border border-emerald-400/80 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[10px]">1x</span>
              </button>

              <button
                onClick={() => onSetSimSpeed?.(2)}
                title="Vitesse rapide (2x)"
                className={`p-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                  simSpeed === 2
                    ? 'bg-cyan-500/30 border border-cyan-400/80 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FastForward className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[10px]">2x</span>
              </button>
            </div>

            {/* Active Camera Follow Indicator */}
            {followedAgentName && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-200 text-xs font-mono">
                <span className="animate-pulse">🎥</span>
                <span className="truncate max-w-[90px] sm:max-w-[130px] font-medium">{followedAgentName}</span>
                <button
                  onClick={onStopFollow}
                  title="Quitter le mode suivi"
                  className="p-0.5 hover:bg-cyan-800/60 rounded text-cyan-300 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* CEO Orchestrator & Dispatch */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
              <button
                onClick={onOpenCEODispatch}
                title="Orchestrateur CEO (Aura) — Décomposition et Dispatch Multi-Pôles"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/35 hover:to-amber-600/45 text-amber-300 hover:text-white border border-amber-500/50 hover:border-amber-400 shadow-sm shadow-amber-950/40 transition-all group"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px]">Dispatch CEO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </button>
            </div>

            {/* Ecosystem Features: Pipelines, AgentOps & Settings */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
              <button
                onClick={onOpenPipelines}
                title="Orchestrateur de Pipelines Multi-Agents (Workflows DAG)"
                className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-mono text-cyan-300 hover:text-white hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 transition-all group"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-[11px]">Pipelines</span>
                {isPipelineRunning && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>

              <button
                onClick={onOpenAgentOps}
                title="Console d'Observabilité AgentOps & Traces de Raisonnement"
                className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-mono text-purple-300 hover:text-white hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 transition-all group"
              >
                <Activity className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-[11px]">AgentOps</span>
              </button>

              <button
                onClick={onOpenSettings}
                title="Paramètres de Gouvernance & Connecteurs"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-300 hover:text-cyan-300" />
              </button>
            </div>

            {/* Camera View Presets */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
              <button
                onClick={() => onSetIsometricView?.()}
                title="Vue Isométrique classique Sims (45°)"
                className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-mono text-cyan-300 hover:text-white hover:bg-cyan-950/60 border border-transparent hover:border-cyan-500/30 transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden lg:inline text-[11px]">Vue Sims</span>
              </button>

              <button
                onClick={onResetView}
                title="Vue d'ensemble du Campus"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Building className="w-4 h-4" />
              </button>

              <button
                onClick={handleMute}
                title={isMuted ? 'Activer le son' : 'Couper le son'}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setShowHelpModal(true)}
                title="Guide du Jeu & Commandes"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-cyan-300" />
              </button>

              {/* Pin / Unpin Auto-hide */}
              <button
                onClick={() => setIsPinned((prev) => !prev)}
                title={isPinned ? 'Désactiver le verrouillage (masquage auto actif)' : 'Verrouiller la barre ouverte'}
                className={`p-1.5 rounded-xl transition-colors ${
                  isPinned ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Game Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 max-w-md w-full shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-emerald-400 rotate-45 border border-white" />
                <h3 className="font-bold text-white text-base">Guide de Simulation Work Sims 3D</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="text-xl">🖱️</span>
                <div>
                  <strong className="text-white block">Click-to-Move :</strong>
                  Sélectionnez un agent puis cliquez n&apos;importe où sur le sol pour le faire marcher !
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-xl">🎥</span>
                <div>
                  <strong className="text-white block">Caméra Suivie :</strong>
                  Cliquez sur &apos;Suivre (Caméra)&apos; pour suivre un agent de près pendant ses déplacements et ses tâches.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-xl">📊</span>
                <div>
                  <strong className="text-white block">Volet Rétractable & Compétences :</strong>
                  Dépliez le volet en bas pour consulter les fiches détaillées, compétences et le journal d&apos;activité en temps réel.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-xl">🎮</span>
                <div>
                  <strong className="text-white block">Mode FPS Immersion :</strong>
                  Incarnez n&apos;importe quel agent et explorez les bureaux en vue subjective avec <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-cyan-300">WASD / ZQSD</kbd>.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white text-sm shadow-lg shadow-cyan-950/40 transition-colors"
            >
              Compris, place au jeu !
            </button>
          </div>
        </div>
      )}
    </>
  );
};
