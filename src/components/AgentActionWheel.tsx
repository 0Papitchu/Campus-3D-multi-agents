import React, { useState } from 'react';
import {
  Briefcase,
  Coffee,
  Users,
  Sparkles,
  Video,
  Gamepad2,
  Server,
  X,
  Zap,
  Lightbulb,
  Heart,
  ChevronRight,
} from 'lucide-react';
import type { Agent } from '../types/world.ts';

interface AgentActionWheelProps {
  agent: Agent;
  isFollowed?: boolean;
  onClose: () => void;
  onSendToDesk: (agentId: string) => void;
  onSendToCoffee: (agentId: string) => void;
  onSendToMeeting: (agentId: string) => void;
  onSendToLounge: (agentId: string) => void;
  onSendToServers: (agentId: string) => void;
  onFollowAgent: (agentId: string) => void;
  onEnterFPS: (agentId: string) => void;
  onCheerThought?: (agentId: string, emoji: string, text: string) => void;
}

export const AgentActionWheel: React.FC<AgentActionWheelProps> = ({
  agent,
  isFollowed = false,
  onClose,
  onSendToDesk,
  onSendToCoffee,
  onSendToMeeting,
  onSendToLounge,
  onSendToServers,
  onFollowAgent,
  onEnterFPS,
  onCheerThought,
}) => {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'desk',
      label: 'Au bureau',
      sub: 'Travailler à son poste',
      icon: Briefcase,
      color: 'border-sky-400 text-sky-300 hover:bg-sky-500/25',
      handler: () => onSendToDesk(agent.id),
    },
    {
      id: 'coffee',
      label: 'Pause Café',
      sub: 'Prendre un expresso barista',
      icon: Coffee,
      color: 'border-amber-400 text-amber-300 hover:bg-amber-500/25',
      handler: () => onSendToCoffee(agent.id),
    },
    {
      id: 'meeting',
      label: 'En réunion',
      sub: 'Rejoindre la salle vitrée',
      icon: Users,
      color: 'border-purple-400 text-purple-300 hover:bg-purple-500/25',
      handler: () => onSendToMeeting(agent.id),
    },
    {
      id: 'lounge',
      label: 'Salon Lounge',
      sub: 'Se détendre sur le sofa',
      icon: Sparkles,
      color: 'border-emerald-400 text-emerald-300 hover:bg-emerald-500/25',
      handler: () => onSendToLounge(agent.id),
    },
    {
      id: 'follow',
      label: isFollowed ? 'Quitter Suivi' : 'Suivre (Caméra)',
      sub: isFollowed ? 'Libérer la caméra' : 'Suivre en vue rapprochée',
      icon: Video,
      color: isFollowed
        ? 'border-cyan-300 bg-cyan-500/30 text-cyan-200'
        : 'border-cyan-400 text-cyan-300 hover:bg-cyan-500/25',
      handler: () => onFollowAgent(agent.id),
    },
    {
      id: 'fps',
      label: 'Incarner (FPS)',
      sub: 'Explorer le campus en 1ère personne',
      icon: Gamepad2,
      color: 'border-teal-400 text-teal-300 hover:bg-teal-500/25',
      handler: () => onEnterFPS(agent.id),
    },
  ];

  if (agent.poleId === 'tech') {
    actions.push({
      id: 'servers',
      label: 'Baie Serveurs',
      sub: 'Vérifier les clusters GPU',
      icon: Server,
      color: 'border-blue-400 text-blue-300 hover:bg-blue-500/25',
      handler: () => onSendToServers(agent.id),
    });
  }

  return (
    <div className="absolute top-16 right-4 sm:right-6 z-30 pointer-events-none w-84 max-w-[94vw] transition-all duration-300 animate-in fade-in zoom-in-95">
      <div className="pointer-events-auto bg-slate-950/95 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-4 shadow-2xl shadow-cyan-950/60 text-slate-100 ring-1 ring-cyan-400/25">
        {/* Header with Sims Plumbob & Agent Identity */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner border-2 border-emerald-400 shrink-0"
                style={{ backgroundColor: agent.clothesColor || '#0284c7' }}
              >
                <span className="text-base">👤</span>
              </div>
              <div className="absolute -top-1.5 -right-1 w-3.5 h-3.5 bg-emerald-400 rotate-45 border border-white shadow-md animate-bounce" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate max-w-[170px] flex items-center gap-1.5">
                {agent.name}
              </h2>
              <p className="text-[10px] text-cyan-300 font-mono truncate max-w-[170px]">
                {agent.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Fermer la roue"
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current State / Thought Banner */}
        <div className="my-3 px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2">
          <span className="text-base shrink-0">💭</span>
          <div className="min-w-0">
            <span className="text-[9px] uppercase tracking-wider font-mono text-cyan-400 font-bold block">
              Pensée actuelle
            </span>
            <p className="text-xs text-slate-200 font-medium truncate mt-0.5">
              {agent.currentTask || 'Au bureau'}
            </p>
          </div>
        </div>

        {/* Radial Action Ring Buttons Grid */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold block px-1">
            Menu d&apos;Actions Sims
          </span>

          <div className="grid grid-cols-2 gap-2">
            {actions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={act.handler}
                  onMouseEnter={() => setHoveredAction(act.sub)}
                  onMouseLeave={() => setHoveredAction(null)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-900/80 border text-xs font-semibold text-slate-200 hover:text-white transition-all text-left group shadow-sm ${act.color}`}
                >
                  <Icon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{act.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Action Tooltip Hint */}
        <div className="mt-2.5 h-6 flex items-center justify-center text-[11px] font-mono text-cyan-300 bg-slate-900/60 rounded-lg border border-slate-800/80 px-2 truncate">
          {hoveredAction ? (
            <span className="animate-in fade-in duration-150">👉 {hoveredAction}</span>
          ) : (
            <span className="text-slate-400">💡 Cliquez n&apos;importe où sur le sol pour déplacer l&apos;agent</span>
          )}
        </div>

        {/* Sims Mood/Cheer Sparks */}
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-mono">Booster le moral :</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onCheerThought?.(agent.id, '☕', 'Besoin de café !')}
              title="Envie de café"
              className="p-1 rounded-lg bg-slate-900 hover:bg-amber-950 border border-slate-800 hover:border-amber-400 transition-colors"
            >
              ☕
            </button>
            <button
              onClick={() => onCheerThought?.(agent.id, '💡', 'Idée de génie !')}
              title="Idée brillante"
              className="p-1 rounded-lg bg-slate-900 hover:bg-yellow-950 border border-slate-800 hover:border-yellow-400 transition-colors"
            >
              💡
            </button>
            <button
              onClick={() => onCheerThought?.(agent.id, '⚡', 'Super boost !')}
              title="Super boost d'énergie"
              className="p-1 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-400 transition-colors"
            >
              ⚡
            </button>
            <button
              onClick={() => onCheerThought?.(agent.id, '🎉', 'Sprint terminé !')}
              title="Célébration"
              className="p-1 rounded-lg bg-slate-900 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-400 transition-colors"
            >
              🎉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
