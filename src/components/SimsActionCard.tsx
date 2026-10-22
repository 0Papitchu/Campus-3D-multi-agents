import React, { useState } from 'react';
import {
  Coffee,
  Briefcase,
  Users,
  Armchair,
  Gamepad2,
  X,
  Server,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Video,
} from 'lucide-react';
import type { Agent } from '../types/world.ts';

interface SimsActionCardProps {
  agent: Agent;
  onClose: () => void;
  onSendToDesk: (agentId: string) => void;
  onSendToCoffee: (agentId: string) => void;
  onSendToMeeting: (agentId: string) => void;
  onSendToLounge: (agentId: string) => void;
  onSendToServers: (agentId: string) => void;
  onEnterFPS: (agentId: string) => void;
  onFollowAgent?: (agentId: string) => void;
  isFollowed?: boolean;
}

export const SimsActionCard: React.FC<SimsActionCardProps> = ({
  agent,
  onClose,
  onSendToDesk,
  onSendToCoffee,
  onSendToMeeting,
  onSendToLounge,
  onSendToServers,
  onEnterFPS,
  onFollowAgent,
  isFollowed = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="absolute top-16 right-3 sm:right-5 z-30 pointer-events-none w-80 max-w-[92vw]">
      <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-cyan-500/35 rounded-2xl shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden transition-all duration-300 ring-1 ring-cyan-400/20">
        {/* Header with Sims Plumbob Icon */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-emerald-400 rotate-45 border border-white shadow-sm shadow-emerald-400/80 shrink-0" />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[170px]">
                {agent.name}
              </h2>
              <p className="text-[10px] text-cyan-300 font-mono truncate max-w-[170px]">
                {agent.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-label={isExpanded ? 'Réduire' : 'Agrandir'}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Body */}
        {isExpanded && (
          <div className="p-3 space-y-3">
            {/* Current Thought / Activity Bubble */}
            <div className="flex items-start gap-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-2.5">
              <span className="text-xl shrink-0">💭</span>
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider font-mono text-cyan-400 font-bold block">
                  Activité en cours
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed mt-0.5 line-clamp-2">
                  {agent.currentTask || 'Travail au bureau'}
                </p>
              </div>
            </div>

            {/* Quick 1-Click Sims Action Buttons */}
            <div>
              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-bold block mb-1.5 px-0.5">
                Actions Sims
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onSendToDesk(agent.id)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900/80 hover:bg-sky-600/20 border border-slate-700/80 hover:border-sky-400 text-xs font-medium text-slate-200 hover:text-white transition-all text-left group"
                >
                  <Briefcase className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Au bureau</span>
                </button>

                <button
                  onClick={() => onSendToCoffee(agent.id)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900/80 hover:bg-amber-600/20 border border-slate-700/80 hover:border-amber-400 text-xs font-medium text-slate-200 hover:text-white transition-all text-left group"
                >
                  <Coffee className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Pause Café</span>
                </button>

                <button
                  onClick={() => onSendToMeeting(agent.id)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900/80 hover:bg-purple-600/20 border border-slate-700/80 hover:border-purple-400 text-xs font-medium text-slate-200 hover:text-white transition-all text-left group"
                >
                  <Users className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">En réunion</span>
                </button>

                <button
                  onClick={() => onSendToLounge(agent.id)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900/80 hover:bg-emerald-600/20 border border-slate-700/80 hover:border-emerald-400 text-xs font-medium text-slate-200 hover:text-white transition-all text-left group"
                >
                  <Armchair className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">Lounge</span>
                </button>

                {agent.poleId === 'tech' && (
                  <button
                    onClick={() => onSendToServers(agent.id)}
                    className="col-span-2 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-cyan-600/20 border border-slate-700/80 hover:border-cyan-400 text-xs font-medium text-slate-200 hover:text-white transition-all text-left group"
                  >
                    <Server className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>Inspecter la baie serveurs</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons: Camera Follow & FPS */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onFollowAgent?.(agent.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border font-bold text-xs shadow-md transition-all ${
                  isFollowed
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 hover:bg-cyan-950/80 border-slate-700 hover:border-cyan-400 text-cyan-300 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{isFollowed ? 'Quitter Suivi' : 'Suivre (Cam)'}</span>
              </button>

              <button
                onClick={() => onEnterFPS(agent.id)}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all transform active:scale-95"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Incarner (FPS)</span>
              </button>
            </div>

            {/* Click-to-move hint */}
            <div className="text-[10px] text-center text-slate-400 font-mono">
              💡 Cliquez n&apos;importe où sur le sol pour déplacer l&apos;agent
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
