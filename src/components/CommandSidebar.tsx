import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Palette,
  Video,
  UserCheck,
  Radio,
  Building2,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlusCircle,
  Eye,
  SlidersHorizontal,
  Layers,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  AGENT_STATES_CONFIG,
  type Agent,
  type AgentState,
  type Pole,
  type Project,
  type DataFlowConnection,
  type SystemEvent,
  type PoleId,
} from '../types/world.ts';

interface CommandSidebarProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  poles: Pole[];
  agents: Agent[];
  projects: Project[];
  dataFlows: DataFlowConnection[];
  events: SystemEvent[];
  selectedPoleId: PoleId | null;
  onSelectPole: (poleId: PoleId) => void;
  onEnterInterior: (poleId: PoleId) => void;
  onSelectAgent: (agentId: string) => void;
  onSelectDataFlow: (flowId: string) => void;
  onOpenNewMission: () => void;
}

type SidebarTab = 'districts' | 'agents' | 'missions' | 'flows' | 'projects' | 'diagnostics';

const DISTRICT_ICONS: Record<PoleId, React.ReactNode> = {
  tech: <Cpu className="w-4 h-4 text-sky-400" />,
  carole: <Palette className="w-4 h-4 text-rose-400" />,
  contenu: <Video className="w-4 h-4 text-purple-400" />,
  personnel: <UserCheck className="w-4 h-4 text-emerald-400" />,
};

export const CommandSidebar: React.FC<CommandSidebarProps> = ({
  isOpen,
  onToggleOpen,
  poles,
  agents,
  projects,
  dataFlows,
  events,
  selectedPoleId,
  onSelectPole,
  onEnterInterior,
  onSelectAgent,
  onSelectDataFlow,
  onOpenNewMission,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('districts');
  const [agentFilter, setAgentFilter] = useState<'all' | 'working' | 'review' | 'error'>('all');

  const filteredAgents = agents.filter((a) => {
    if (agentFilter === 'all') return true;
    if (agentFilter === 'working') return a.status === 'working' || a.status === 'thinking';
    if (agentFilter === 'review') return a.status === 'review';
    if (agentFilter === 'error') return a.status === 'error';
    return true;
  });

  return (
    <aside
      className={`fixed top-14 sm:top-16 bottom-3 left-3 z-30 transition-all duration-300 pointer-events-none flex items-stretch ${
        isOpen ? 'w-80 sm:w-96' : 'w-10'
      }`}
    >
      {/* Toggle Tab Button */}
      <div className="flex items-center">
        <button
          onClick={onToggleOpen}
          aria-label={isOpen ? 'Réduire la barre latérale' : 'Déployer le centre de commandement'}
          className="pointer-events-auto p-1.5 bg-slate-950/95 border border-slate-700/80 rounded-r-xl text-cyan-400 hover:text-white shadow-xl hover:bg-slate-800 transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Drawer Body */}
      {isOpen && (
        <div className="pointer-events-auto flex-1 bg-slate-950/95 border border-slate-800/90 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden text-white ml-1">
          {/* Sidebar Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 p-1.5 overflow-x-auto text-[11px] font-mono">
            <button
              onClick={() => setActiveTab('districts')}
              className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0 ${
                activeTab === 'districts'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pôles</span>
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0 ${
                activeTab === 'agents'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Agents ({agents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('flows')}
              className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0 ${
                activeTab === 'flows'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Flux ({dataFlows.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0 ${
                activeTab === 'projects'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Projets</span>
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans">
            {/* TAB 1: DISTRICTS */}
            {activeTab === 'districts' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>4 DISTRICTS OPÉRATIONNELS</span>
                  <span className="text-[10px] text-cyan-400">3 NIVEAUX DE ZOOM</span>
                </div>

                {poles.map((pole) => {
                  const isSelected = selectedPoleId === pole.id;
                  const poleAgents = agents.filter((a) => a.poleId === pole.id);

                  return (
                    <div
                      key={pole.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: pole.accentColor }}
                          />
                          <h4 className="text-xs font-bold text-slate-100 font-mono">
                            {pole.name}
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {pole.codeName.split('//')[0].trim()}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-2.5">
                        {pole.description}
                      </p>

                      {/* Active Modules Chips */}
                      <div className="flex flex-wrap gap-1 mb-2.5">
                        {pole.activeModules.slice(0, 2).map((m) => (
                          <span
                            key={m}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                          >
                            {m}
                          </span>
                        ))}
                      </div>

                      {/* Navigation Controls */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
                        <button
                          onClick={() => onSelectPole(pole.id)}
                          className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>District</span>
                        </button>
                        <button
                          onClick={() => onEnterInterior(pole.id)}
                          className="flex-1 py-1 px-2 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Intérieur</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: AGENTS ROSTER */}
            {activeTab === 'agents' && (
              <div className="space-y-3">
                {/* State Filters */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
                  <button
                    onClick={() => setAgentFilter('all')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      agentFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Tous ({agents.length})
                  </button>
                  <button
                    onClick={() => setAgentFilter('working')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      agentFilter === 'working' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Actifs
                  </button>
                  <button
                    onClick={() => setAgentFilter('review')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      agentFilter === 'review' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    À valider
                  </button>
                  <button
                    onClick={() => setAgentFilter('error')}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      agentFilter === 'error' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Erreur
                  </button>
                </div>

                {filteredAgents.map((ag) => {
                  const stateCfg = AGENT_STATES_CONFIG[ag.status];
                  return (
                    <button
                      key={ag.id}
                      onClick={() => onSelectAgent(ag.id)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-2.5 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                            {ag.name}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {ag.systemId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mb-1">
                          {ag.currentTask}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                          <span>CPU: {ag.cpuLoad}%</span>
                          <span>•</span>
                          <span>NET: {ag.networkThroughput} KB/s</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${stateCfg.badgeBg} ${stateCfg.borderColor} ${stateCfg.textColor}`}
                        >
                          {stateCfg.shortLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB 3: FLIGHTRADAR & DATA FLOWS */}
            {activeTab === 'flows' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>FLUX DE DONNÉES ACTIFS</span>
                  <span className="text-amber-400">{dataFlows.length} PIPELINES</span>
                </div>

                {dataFlows.map((flow) => (
                  <button
                    key={flow.id}
                    onClick={() => onSelectDataFlow(flow.id)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-amber-300">{flow.payloadType}</span>
                      <span className="text-[10px] text-slate-400">{flow.latencyMs} ms</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <span className="text-slate-400">{flow.fromDistrictId.toUpperCase()}</span>
                      <span className="text-amber-400">⟶</span>
                      <span className="text-slate-400">{flow.toDistrictId.toUpperCase()}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Statut : {flow.status.toUpperCase()}</span>
                      <span>{flow.timestamp}</span>
                    </div>
                  </button>
                ))}

                {/* Real-time System Event Feed */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TIMELINE DES ÉVÉNEMENTS RÉCENTS</span>
                  </div>
                  <div className="space-y-1.5">
                    {events.slice(0, 5).map((evt) => (
                      <div
                        key={evt.id}
                        className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/60 text-[10px] font-mono space-y-0.5"
                      >
                        <div className="flex items-center justify-between text-slate-500">
                          <span>{evt.timestamp}</span>
                          <span
                            className={
                              evt.severity === 'error'
                                ? 'text-rose-400 font-bold'
                                : evt.severity === 'warning'
                                ? 'text-amber-400'
                                : evt.severity === 'success'
                                ? 'text-emerald-400'
                                : 'text-cyan-400'
                            }
                          >
                            {evt.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-300 font-sans">{evt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PROJECTS / GITHUB CITY */}
            {activeTab === 'projects' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>PROJETS GITHUB CITY</span>
                  <span className="text-purple-400">{projects.length} ACTIFS</span>
                </div>

                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-purple-300 font-mono">
                          {proj.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {proj.code} • District {proj.districtId.toUpperCase()}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          proj.health === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : proj.health === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {proj.health.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {proj.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>{proj.tasksCount} TÂCHES</span>
                      <span>COMMIT {proj.commitHash}</span>
                      <span>{proj.deliverablesCount} LIVRABLES</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Quick Action */}
          <div className="p-2.5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2">
            <button
              onClick={onOpenNewMission}
              className="w-full py-2 px-3 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>NOUVELLE MISSION</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
