import React from 'react';
import { Compass, Footprints, LogOut, Eye, ShieldAlert } from 'lucide-react';
import type { Agent } from '../types/world.ts';

interface FPSOverlayProps {
  agent: Agent | null;
  locationName: string;
  onExitFPS: () => void;
}

export const FPSOverlay: React.FC<FPSOverlayProps> = ({ agent, locationName, onExitFPS }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 select-none font-mono">
      {/* Top Bar: Agent Telemetry & Location + Exit Button */}
      <div className="flex items-start justify-between gap-4">
        {/* Left: Active Agent Identity */}
        <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-xl backdrop-blur-sm text-white">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white border border-white/20 shrink-0"
            style={{ backgroundColor: agent?.clothesColor || '#0284c7' }}
          >
            {agent?.name.substring(0, 2).toUpperCase() || 'IA'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold tracking-wider">
                VUE PREMIÈRE PERSONNE (FPS)
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                {agent?.systemId || 'AGENT'}
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-100">{agent?.name || 'Agent IA'}</h2>
          </div>
        </div>

        {/* Center: Current Location Compass */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-200 shadow-xl backdrop-blur-sm text-xs">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="text-slate-400">ZONE :</span>
          <span className="font-bold text-cyan-300">{locationName}</span>
        </div>

        {/* Right: Exit FPS Mode Button */}
        <button
          onClick={onExitFPS}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-950/90 border border-rose-500/50 hover:bg-rose-600 hover:border-rose-400 text-white shadow-xl hover:shadow-rose-950/50 transition-all font-bold text-xs group"
        >
          <LogOut className="w-4 h-4 text-rose-300 group-hover:text-white transition-transform group-hover:-translate-x-0.5" />
          <span>Quitter FPS [Échap]</span>
        </button>
      </div>

      {/* Screen Center: Reticle / Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Subtle center dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
          {/* Subtle outer crosshair notches */}
          <div className="absolute top-0 w-0.5 h-2 bg-cyan-400/50" />
          <div className="absolute bottom-0 w-0.5 h-2 bg-cyan-400/50" />
          <div className="absolute left-0 h-0.5 w-2 bg-cyan-400/50" />
          <div className="absolute right-0 h-0.5 w-2 bg-cyan-400/50" />
        </div>
      </div>

      {/* Bottom Bar: Controls Guidance Bar */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-300 shadow-2xl backdrop-blur-sm text-xs">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-cyan-300">
              Z Q S D
            </kbd>
            <span className="text-slate-400">ou</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-cyan-300">
              Flèches
            </kbd>
            <span className="text-slate-400">Marcher</span>
          </div>

          <span className="text-slate-700">·</span>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-cyan-300">
              Shift
            </kbd>
            <span className="text-slate-400">Courir</span>
          </div>

          <span className="text-slate-700">·</span>

          <div className="flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Glisser souris pour regarder</span>
          </div>
        </div>
      </div>
    </div>
  );
};
