import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Users,
  ScrollText,
  Activity,
  Coffee,
  Briefcase,
  Video,
  Gamepad2,
  Server,
  Zap,
  Clock,
  Sparkles,
  Search,
  Filter,
  Crown,
} from 'lucide-react';
import type { Agent, PoleId, SystemEvent } from '../types/world.ts';

interface SimsBottomBarProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onSelectAgent: (agentId: string) => void;
  onEnterFPS: (agentId: string) => void;
  onFollowAgent?: (agentId: string) => void;
  followedAgentId?: string | null;
  events?: SystemEvent[];
  onSendToDesk?: (agentId: string) => void;
  onSendToCoffee?: (agentId: string) => void;
  onSendToMeeting?: (agentId: string) => void;
  onSendToLounge?: (agentId: string) => void;
  onSendToServers?: (agentId: string) => void;
  onOpenCEODispatch?: () => void;
}

const POLE_INFO: Record<
  PoleId,
  { border: string; bg: string; text: string; label: string; accent: string }
> = {
  tech: {
    border: 'border-sky-400',
    bg: 'bg-sky-500/20',
    text: 'text-sky-300',
    label: 'Tech',
    accent: '#38bdf8',
  },
  carole: {
    border: 'border-rose-400',
    bg: 'bg-rose-500/20',
    text: 'text-rose-300',
    label: 'Carole',
    accent: '#fb7185',
  },
  contenu: {
    border: 'border-purple-400',
    bg: 'bg-purple-500/20',
    text: 'text-purple-300',
    label: 'Média',
    accent: '#c084fc',
  },
  personnel: {
    border: 'border-emerald-400',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    label: 'Nexus',
    accent: '#34d399',
  },
};

const STATUS_EMOJIS: Record<string, string> = {
  working: '💻',
  thinking: '💡',
  waiting: '⏳',
  review: '🎨',
  done: '✅',
  error: '⚠️',
  offline: '💤',
  idle: '☕',
};

// Domain-specific skills breakdown for each agent
const AGENT_SKILLS: Record<string, { label: string; score: number }[]> = {
  'tech-dev-ia': [
    { label: 'WebGL & Three.js', score: 98 },
    { label: 'Architecture IA', score: 94 },
    { label: 'Microservices', score: 91 },
    { label: 'GPU Shaders', score: 86 },
  ],
  'tech-veille': [
    { label: 'Veille & Benchmark', score: 96 },
    { label: 'Modèles Multimodaux', score: 92 },
    { label: 'Latence Inférence', score: 89 },
    { label: 'Cloud Distribué', score: 85 },
  ],
  'carole-styliste': [
    { label: 'Direction Stylisme', score: 98 },
    { label: 'Harmonie Chromatique', score: 95 },
    { label: 'Drapés 3D Virtuels', score: 92 },
    { label: 'Matières & Textures', score: 88 },
  ],
  'carole-tendances': [
    { label: 'Curation Moodboard', score: 95 },
    { label: 'Matières Éco-bio', score: 92 },
    { label: 'Analyse Milan/Paris', score: 90 },
    { label: 'Palette Saisonnière', score: 87 },
  ],
  'contenu-script': [
    { label: 'Scénarisation Vidéo', score: 98 },
    { label: 'Accroches Virales', score: 95 },
    { label: 'Storyboarding', score: 92 },
    { label: 'Rythme & Narration', score: 89 },
  ],
  'contenu-montage': [
    { label: 'Montage & Cadence', score: 96 },
    { label: 'Sous-titres Cinétiques', score: 94 },
    { label: 'Motion Design', score: 91 },
    { label: 'Format TikTok / Reels', score: 93 },
  ],
  'perso-assistant': [
    { label: 'Deep Work Planning', score: 96 },
    { label: 'Arbitrage Pôles', score: 94 },
    { label: 'Triage Flux & Urgences', score: 92 },
    { label: 'Coordination Campus', score: 90 },
  ],
  'perso-organisateur': [
    { label: 'Allocation Clusters GPU', score: 95 },
    { label: 'Résolution Conflits', score: 93 },
    { label: 'Agile & Délais', score: 90 },
    { label: 'Optimisation Coûts', score: 87 },
  ],
  'ceo-orchestrator': [
    { label: 'Décomposition Stratégique', score: 99 },
    { label: 'Dispatch Multi-Pôles', score: 98 },
    { label: 'Arbitrage & Priorités', score: 97 },
    { label: 'Gouvernance Globale', score: 95 },
  ],
};

export const SimsBottomBar: React.FC<SimsBottomBarProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onEnterFPS,
  onFollowAgent,
  followedAgentId,
  events = [],
  onSendToDesk,
  onSendToCoffee,
  onSendToMeeting,
  onSendToLounge,
  onSendToServers,
  onOpenCEODispatch,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'events'>('roster');
  const [filterPole, setFilterPole] = useState<string>('all');
  const [eventSearch, setEventSearch] = useState<string>('');

  const filteredAgents =
    filterPole === 'all' ? agents : agents.filter((a) => a.poleId === filterPole);

  const filteredEvents = events.filter((ev) => {
    if (filterPole !== 'all' && ev.districtId !== filterPole) return false;
    if (eventSearch.trim()) {
      return (
        ev.description.toLowerCase().includes(eventSearch.toLowerCase()) ||
        ev.agentId?.toLowerCase().includes(eventSearch.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full max-w-5xl px-2 sm:px-4 transition-all duration-300">
      {/* Central Drawer Open/Close Toggle Button */}
      <div className="flex justify-center mb-1.5 pointer-events-auto">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium shadow-xl backdrop-blur-md transition-all border ${
            isExpanded
              ? 'bg-cyan-950/90 text-cyan-200 border-cyan-400 hover:bg-cyan-900 shadow-cyan-950/60'
              : 'bg-slate-950/85 text-slate-300 border-cyan-500/40 hover:text-white hover:border-cyan-400 hover:bg-slate-900 shadow-black/50'
          }`}
        >
          <div className="w-2.5 h-2.5 bg-emerald-400 rotate-45 border border-white" />
          <span>
            {isExpanded
              ? '▼ Réduire le volet'
              : '▲ Volet Rétractable (Équipe, Compétences & Journal)'}
          </span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Container: Compact Hotbar vs Expanded Drawer */}
      <div className="pointer-events-auto bg-slate-950/92 backdrop-blur-md border border-cyan-500/35 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100 transition-all duration-300">
        {/* =========================================================================
            EXPANDED DRAWER MODE
            ========================================================================= */}
        {isExpanded ? (
          <div className="p-3 sm:p-4 max-h-[72vh] flex flex-col space-y-3">
            {/* Header: Tabs + Pole Filters */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5 shrink-0">
              {/* Tab Switcher */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('roster')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'roster'
                      ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Fiches Agents & Compétences ({filteredAgents.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'events'
                      ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ScrollText className="w-3.5 h-3.5" />
                  <span>Journal d&apos;Activité en Direct ({events.length})</span>
                </button>
              </div>

              {/* Pole Filters */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                <button
                  onClick={() => setFilterPole('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                    filterPole === 'all'
                      ? 'bg-slate-200 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Tous ({agents.length})
                </button>
                {(['tech', 'carole', 'contenu', 'personnel'] as PoleId[]).map((pid) => {
                  const p = POLE_INFO[pid];
                  const count = agents.filter((a) => a.poleId === pid).length;
                  const active = filterPole === pid;
                  return (
                    <button
                      key={pid}
                      onClick={() => setFilterPole(pid)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                        active
                          ? `${p.bg} ${p.border} ${p.text} font-bold shadow-sm`
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: DETAILED AGENT CARDS & SKILLS */}
            {activeTab === 'roster' && (
              <div className="overflow-y-auto pr-1 space-y-3 max-h-[56vh] scrollbar-thin scrollbar-thumb-cyan-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredAgents.map((agent) => {
                    const isSelected = agent.id === selectedAgentId;
                    const isFollowed = agent.id === followedAgentId;
                    const poleStyle = POLE_INFO[agent.poleId];
                    const emoji = STATUS_EMOJIS[agent.status] || '💻';
                    const energy = Math.max(30, Math.min(100, 100 - (agent.cpuLoad || 50) * 0.4));
                    const skills = AGENT_SKILLS[agent.id] || [
                      { label: 'Efficacité Tâche', score: 92 },
                      { label: 'Concentration', score: 88 },
                      { label: 'Collaboration', score: 90 },
                      { label: 'Résilience', score: 85 },
                    ];

                    return (
                      <div
                        key={agent.id}
                        className={`rounded-xl p-3 border transition-all bg-slate-900/70 hover:bg-slate-900/90 ${
                          isSelected
                            ? 'border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40'
                            : 'border-slate-800 hover:border-cyan-500/40'
                        }`}
                      >
                        {/* Top: Avatar, Names, Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <div
                                className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-inner border-2 shrink-0"
                                style={{
                                  backgroundColor: agent.clothesColor || '#0284c7',
                                  borderColor: isSelected ? '#34d399' : '#475569',
                                }}
                              >
                                {emoji}
                              </div>
                              {isSelected && (
                                <div className="absolute -top-1.5 -right-1 w-3.5 h-3.5 bg-emerald-400 rotate-45 border border-white shadow-sm animate-pulse" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                                  {agent.name}
                                </h3>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${poleStyle.bg} ${poleStyle.border} ${poleStyle.text}`}
                                >
                                  {poleStyle.label}
                                </span>
                              </div>
                              <p className="text-[11px] text-cyan-300 font-mono truncate">
                                {agent.role}
                              </p>
                            </div>
                          </div>

                          {/* Quick selection button */}
                          <button
                            onClick={() => onSelectAgent(agent.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                              isSelected
                                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400'
                                : 'bg-slate-800 text-slate-300 hover:bg-cyan-900 hover:text-white'
                            }`}
                          >
                            {isSelected ? '✓ Actif' : 'Sélectionner'}
                          </button>
                        </div>

                        {/* Current Thought / Task */}
                        <div className="mt-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 flex items-start gap-2">
                          <span className="text-sm shrink-0">💭</span>
                          <div className="min-w-0">
                            <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold block">
                              Activité actuelle
                            </span>
                            <p className="text-xs text-slate-200 truncate mt-0.5 font-medium">
                              {agent.currentTask}
                            </p>
                          </div>
                        </div>

                        {/* Gauges: Sims Energy & Workload */}
                        <div className="grid grid-cols-2 gap-2 mt-2.5 text-[10px] font-mono">
                          <div>
                            <div className="flex justify-between text-slate-400 mb-0.5">
                              <span>Énergie / Humeur</span>
                              <span className="text-emerald-300 font-bold">{Math.round(energy)}%</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  energy > 60
                                    ? 'bg-emerald-400'
                                    : energy > 40
                                    ? 'bg-amber-400'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${energy}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-slate-400 mb-0.5">
                              <span>Charge CPU / Travail</span>
                              <span className="text-cyan-300 font-bold">{agent.cpuLoad || 50}%</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                              <div
                                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                                style={{ width: `${agent.cpuLoad || 50}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Skills Breakdown */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/70">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
                            Compétences Spécialisées
                          </span>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                            {skills.map((sk) => (
                              <div key={sk.label} className="flex items-center justify-between gap-1">
                                <span className="text-slate-300 truncate">{sk.label}</span>
                                <span className="font-mono text-cyan-300 font-semibold shrink-0">
                                  {sk.score}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Direct 1-Click Sims Actions */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                          {agent.id === 'ceo-orchestrator' && (
                            <button
                              onClick={() => onOpenCEODispatch?.()}
                              title="Ouvrir la console de dispatch stratégique du CEO"
                              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/30 to-amber-600/40 hover:from-amber-500/40 hover:to-amber-600/50 border border-amber-400/90 text-[10px] text-amber-200 font-bold transition-all shadow-md shadow-amber-950/60"
                            >
                              <Crown className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                              <span>👑 Dispatcher Directive</span>
                            </button>
                          )}

                          <button
                            onClick={() => onSendToDesk?.(agent.id)}
                            title="Envoyer au bureau"
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-sky-600/30 hover:border-sky-400 border border-slate-700 text-[10px] text-slate-300 hover:text-white transition-colors"
                          >
                            <Briefcase className="w-3 h-3 text-sky-400" />
                            <span>Bureau</span>
                          </button>

                          <button
                            onClick={() => onSendToCoffee?.(agent.id)}
                            title="Envoyer au café"
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-600/30 hover:border-amber-400 border border-slate-700 text-[10px] text-slate-300 hover:text-white transition-colors"
                          >
                            <Coffee className="w-3 h-3 text-amber-400" />
                            <span>Pause Café</span>
                          </button>

                          <button
                            onClick={() => onSendToMeeting?.(agent.id)}
                            title="Envoyer en réunion"
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-600/30 hover:border-purple-400 border border-slate-700 text-[10px] text-slate-300 hover:text-white transition-colors"
                          >
                            <Users className="w-3 h-3 text-purple-400" />
                            <span>Réunion</span>
                          </button>

                          <button
                            onClick={() => onSendToLounge?.(agent.id)}
                            title="Envoyer au lounge"
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-600/30 hover:border-emerald-400 border border-slate-700 text-[10px] text-slate-300 hover:text-white transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>Lounge</span>
                          </button>

                          {/* Follow Camera Button */}
                          <button
                            onClick={() => onFollowAgent?.(agent.id)}
                            title="Suivre la caméra de cet agent"
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-medium transition-colors ${
                              isFollowed
                                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                                : 'bg-slate-800/80 hover:bg-cyan-600/30 hover:border-cyan-400 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            <Video className="w-3 h-3 text-cyan-400" />
                            <span>{isFollowed ? '🎥 Suivi Actif' : '🎥 Suivre'}</span>
                          </button>

                          {/* FPS Mode Button */}
                          <button
                            onClick={() => onEnterFPS(agent.id)}
                            title="Incarner en mode FPS"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-400/60 text-[10px] text-emerald-300 hover:text-white font-medium ml-auto transition-colors"
                          >
                            <Gamepad2 className="w-3 h-3 text-emerald-400" />
                            <span>🎮 FPS</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: LIVE ACTIVITY JOURNAL */}
            {activeTab === 'events' && (
              <div className="space-y-2 max-h-[56vh] flex flex-col">
                {/* Search Bar */}
                <div className="relative shrink-0">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    placeholder="Filtrer les événements par mot-clé ou agent..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Event Stream List */}
                <div className="overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs font-mono">
                      Aucun événement correspondant aux critères
                    </div>
                  ) : (
                    filteredEvents.map((ev) => {
                      const relatedAgent = agents.find((a) => a.id === ev.agentId);
                      const poleStyle = ev.districtId ? POLE_INFO[ev.districtId] : null;

                      let badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
                      if (ev.severity === 'success') {
                        badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                      } else if (ev.severity === 'warning') {
                        badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                      } else if (ev.severity === 'error') {
                        badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                      }

                      return (
                        <div
                          key={ev.id}
                          className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="text-sm mt-0.5">
                              {ev.severity === 'success'
                                ? '✅'
                                : ev.severity === 'warning'
                                ? '⚠️'
                                : ev.severity === 'error'
                                ? '🚨'
                                : '⚡'}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-400">
                                  {ev.timestamp}
                                </span>
                                {poleStyle && (
                                  <span
                                    className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${poleStyle.bg} ${poleStyle.border} ${poleStyle.text}`}
                                  >
                                    {poleStyle.label}
                                  </span>
                                )}
                                {relatedAgent && (
                                  <span className="text-[10px] font-bold text-slate-200">
                                    {relatedAgent.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                                {ev.description}
                              </p>
                            </div>
                          </div>

                          {relatedAgent && (
                            <button
                              onClick={() => onSelectAgent(relatedAgent.id)}
                              className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-cyan-900 text-slate-300 hover:text-white shrink-0 transition-colors"
                            >
                              Inspecter
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
             COMPACT HOTBAR MODE (Sims Quick Roster Dock)
             ========================================================================= */
          <div className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 overflow-x-auto scrollbar-none">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              const isFollowed = agent.id === followedAgentId;
              const poleStyle = POLE_INFO[agent.poleId] || POLE_INFO.tech;
              const emoji = STATUS_EMOJIS[agent.status] || '💻';
              const energy = Math.max(30, Math.min(100, 100 - (agent.cpuLoad || 50) * 0.4));

              const isCEO = agent.id === 'ceo-orchestrator';

              return (
                <button
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  className={`relative flex flex-col items-center p-1.5 sm:p-2 rounded-xl transition-all duration-200 shrink-0 min-w-[70px] sm:min-w-[82px] group text-left ${
                    isSelected
                      ? isCEO
                        ? 'bg-gradient-to-b from-amber-950/90 to-slate-900 border-2 border-amber-400 shadow-lg shadow-amber-500/40 scale-105'
                        : 'bg-gradient-to-b from-cyan-950/90 to-slate-900 border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105'
                      : isCEO
                      ? 'bg-amber-950/30 hover:bg-amber-900/50 border border-amber-500/60 shadow-md shadow-amber-950/30'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/50'
                  }`}
                >
                  {/* Sims Plumbob Floating Diamond on Selected Agent (Golden for CEO) */}
                  {isSelected && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center animate-bounce">
                      <div
                        className={`w-3.5 h-3.5 rotate-45 border border-white shadow-md ${
                          isCEO
                            ? 'bg-amber-400 shadow-amber-400/80'
                            : 'bg-emerald-400 shadow-emerald-400/80'
                        }`}
                      />
                    </div>
                  )}

                  {/* CEO Crown Marker if not selected */}
                  {!isSelected && isCEO && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                      <span className="text-xs filter drop-shadow">👑</span>
                    </div>
                  )}

                  {/* Character Avatar with Clothes Color */}
                  <div className="relative mt-1">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner border-2 ${
                        isCEO ? 'border-amber-400 ring-1 ring-amber-400/50' : ''
                      }`}
                      style={{
                        backgroundColor: agent.clothesColor || '#0284c7',
                        borderColor: isSelected
                          ? isCEO
                            ? '#f59e0b'
                            : '#34d399'
                          : isCEO
                          ? '#f59e0b'
                          : '#475569',
                      }}
                    >
                      <span className="text-base select-none">{emoji}</span>
                    </div>

                    {/* Pole miniature badge */}
                    <span
                      className={`absolute -bottom-1 -right-1 text-[8px] font-bold px-1 rounded-full border bg-slate-950 ${
                        isCEO
                          ? 'border-amber-400 text-amber-300 font-extrabold'
                          : `${poleStyle.border} ${poleStyle.text}`
                      }`}
                    >
                      {isCEO ? 'CEO' : poleStyle.label}
                    </span>
                  </div>

                  {/* Agent Name */}
                  <span
                    className={`mt-1.5 text-[11px] sm:text-xs font-semibold truncate max-w-[74px] sm:max-w-[80px] text-center ${
                      isCEO ? 'text-amber-200 font-bold' : 'text-slate-100'
                    }`}
                  >
                    {agent.name}
                  </span>

                  {/* Sims Energy / Need Bar */}
                  <div className="w-full mt-1 bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        energy > 60
                          ? 'bg-emerald-400'
                          : energy > 40
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${energy}%` }}
                    />
                  </div>

                  {/* Quick Action Badges on Hover */}
                  <div className="mt-1 hidden group-hover:flex items-center gap-1 w-full">
                    {isCEO ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCEODispatch?.();
                        }}
                        title="Ouvrir la console de Dispatch CEO"
                        className="w-full py-0.5 rounded text-[8px] font-mono bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/80 text-amber-200 text-center font-bold transition-colors"
                      >
                        👑 Dispatch
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onFollowAgent?.(agent.id);
                          }}
                          title="Suivre la caméra de cet agent"
                          className="flex-1 py-0.5 rounded text-[8px] font-mono bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-center transition-colors"
                        >
                          {isFollowed ? '🎥 Stop' : '🎥 Suivre'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEnterFPS(agent.id);
                          }}
                          title="Incarner en FPS"
                          className="flex-1 py-0.5 rounded text-[8px] font-mono bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-center transition-colors"
                        >
                          🎮 FPS
                        </button>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
