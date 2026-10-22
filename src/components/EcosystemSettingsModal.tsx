import React, { useState } from 'react';
import {
  X,
  Sliders,
  Shield,
  Link2,
  Database,
  RefreshCw,
  Check,
  AlertTriangle,
  Save,
  Bell,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { EcosystemSettings, AutonomyMode, EcosystemConnector } from '../types/pipeline.ts';

interface EcosystemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EcosystemSettings;
  onUpdateSettings: (newSettings: EcosystemSettings) => void;
}

export const EcosystemSettingsModal: React.FC<EcosystemSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'governance' | 'connectors' | 'quotas'>('governance');
  const [draft, setDraft] = useState<EcosystemSettings>(settings);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSettings(draft);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const toggleConnector = (connId: string) => {
    setDraft((prev) => ({
      ...prev,
      connectors: prev.connectors.map((c) =>
        c.id === connId
          ? { ...c, status: c.status === 'active' || c.status === 'synced' ? 'paused' : 'active' }
          : c
      ),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl shadow-cyan-950/60 text-slate-100 overflow-hidden ring-1 ring-cyan-500/20">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
              <Sliders className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Paramètres & Gouvernance de l&apos;Écosystème
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Règles d&apos;autonomie des agents, connecteurs de données et quotas système
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('governance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'governance'
                ? 'bg-cyan-600/30 border border-cyan-400 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Gouvernance & Autonomie</span>
          </button>

          <button
            onClick={() => setActiveTab('connectors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'connectors'
                ? 'bg-cyan-600/30 border border-cyan-400 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Connecteurs ({draft.connectors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'quotas'
                ? 'bg-cyan-600/30 border border-cyan-400 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Quotas & Politiques de Retry</span>
          </button>
        </div>

        {/* Body Form */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {/* TAB 1: GOUVERNANCE & AUTONOMIE */}
          {activeTab === 'governance' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1.5">
                  Niveau d&apos;Autonomie Global de l&apos;Atelier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      id: 'full_autonomous' as AutonomyMode,
                      title: 'Pleine Autonomie',
                      desc: 'Les agents enchaînent les livrables sans validation intermédiaire.',
                    },
                    {
                      id: 'human_in_the_loop' as AutonomyMode,
                      title: 'Human-in-the-Loop',
                      desc: 'Approbation requise avant de finaliser et livrer en production.',
                    },
                    {
                      id: 'supervised' as AutonomyMode,
                      title: 'Supervisé Strict',
                      desc: 'Alerte et suspension dès qu’une anomalie ou conflit surgit.',
                    },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setDraft({ ...draft, autonomyMode: mode.id })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        draft.autonomyMode === mode.id
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/50'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{mode.title}</span>
                      <span className="text-[11px] text-slate-400 mt-1 block leading-relaxed">
                        {mode.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Validation Obligatoire des Livrables
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Empêche le déploiement tant que l&apos;arbitre Nexus n&apos;a pas signé le manifeste.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.requireApprovalOnDelivery}
                    onChange={(e) =>
                      setDraft({ ...draft, requireApprovalOnDelivery: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Périodes de Pause & Récupération
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Permet aux agents d&apos;aller au café ou au lounge quand leur jauge d&apos;énergie descend sous 40%.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.enforceRestPeriods}
                    onChange={(e) =>
                      setDraft({ ...draft, enforceRestPeriods: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>

                {/* CPU Alert Threshold Slider */}
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">Seuil d&apos;Alerte de Charge CPU</span>
                    <span className="text-cyan-300 font-bold">{draft.cpuAlertThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={draft.cpuAlertThreshold}
                    onChange={(e) =>
                      setDraft({ ...draft, cpuAlertThreshold: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>50% (Sensible)</span>
                    <span>80% (Recommandé)</span>
                    <span>95% (Tolérant)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONNECTEURS */}
          {activeTab === 'connectors' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Connecteurs d&apos;entreprise alimentant en direct les données et déclenchant les pipelines des agents.
              </p>

              <div className="space-y-2.5">
                {draft.connectors.map((conn) => (
                  <div
                    key={conn.id}
                    className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{conn.name}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold ${
                            conn.status === 'synced' || conn.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {conn.status}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-300 block truncate mt-0.5">
                        {conn.endpoint}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                        Dernière synchro : {conn.lastSync} • Événements traités : {conn.eventsProcessed}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleConnector(conn.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono border transition-all ${
                          conn.status === 'active' || conn.status === 'synced'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            : 'bg-emerald-600/30 text-emerald-300 border-emerald-400/50 hover:bg-emerald-600/40'
                        }`}
                      >
                        {conn.status === 'active' || conn.status === 'synced' ? 'Mettre en pause' : 'Activer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: QUOTAS & RETRY */}
          {activeTab === 'quotas' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-white block">
                      Plafond Journalier de Tokens (Quota API)
                    </label>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Limite globale d&apos;inférence pour l&apos;ensemble des agents du campus.
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    {draft.dailyTokenQuota.toLocaleString()} tokens
                  </span>
                </div>

                <input
                  type="number"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={draft.dailyTokenQuota}
                  onChange={(e) =>
                    setDraft({ ...draft, dailyTokenQuota: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1.5">
                  Politique de Repli (Fallback & Retry) en cas d&apos;Erreur
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'auto_retry_pro' as const,
                      title: 'Auto-Retry avec modèle supérieur',
                      desc: 'Relance automatiquement la tâche avec une température basse ou un modèle Pro.',
                    },
                    {
                      id: 'reassign_peer' as const,
                      title: 'Réassignation automatique au pair',
                      desc: 'Bascule la sous-tâche vers un agent homologue du même pôle disponible.',
                    },
                    {
                      id: 'halt_on_error' as const,
                      title: 'Interruption & alerte humaine',
                      desc: 'Suspend le pipeline et notifie l’opérateur pour arbitrage manuel.',
                    },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setDraft({ ...draft, retryPolicy: p.id })}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                        draft.retryPolicy === p.id
                          ? 'bg-cyan-950/60 border-cyan-400 text-white ring-1 ring-cyan-400/40'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 shrink-0 border flex items-center justify-center ${
                          draft.retryPolicy === p.id
                            ? 'border-cyan-400 bg-cyan-400'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {draft.retryPolicy === p.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{p.title}</span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {p.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {savedToast && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Paramètres enregistrés et appliqués !</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/40 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
