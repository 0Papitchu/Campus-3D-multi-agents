import React, { useState } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  Terminal,
  Compass,
  Radio,
  Building2,
  AlertTriangle,
  HelpCircle,
  CornerDownLeft,
} from 'lucide-react';
import type { Agent, Project } from '../types/world.ts';
import { processCopilotQuery, type CopilotResolution } from '../simulation/dataEngine.ts';

interface CopilotConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  projects: Project[];
  onExecuteAction: (action: CopilotResolution['action']) => void;
}

const PRESET_QUERIES = [
  'Quels agents sont actuellement bloqués ?',
  'Montre-moi le projet avec le plus de tâches',
  'Quelles tâches attendent ma validation ?',
  'Ouvre le laboratoire Tech',
  'Active le mode FlightRadar',
  'Active le mode GitHub City',
  'Centre la caméra sur Dev IA',
  'Vue globale Overworld',
];

export const CopilotConsole: React.FC<CopilotConsoleProps> = ({
  isOpen,
  onClose,
  agents,
  projects,
  onExecuteAction,
}) => {
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'copilot'; text: string; action?: CopilotResolution['action'] }>
  >([
    {
      sender: 'copilot',
      text: "Bienvenue dans la console de commandement MONDE ATELIER. Je supervise vos 8 agents et 4 districts. Posez une question ou cliquez sur un ordre tactique ci-dessous.",
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg = text.trim();
    setInputVal('');

    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);

    // Resolve via deterministic NLP engine
    const resolution = processCopilotQuery(userMsg, agents, projects);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'copilot', text: resolution.reply, action: resolution.action },
      ]);
      if (resolution.action) {
        onExecuteAction(resolution.action);
      }
    }, 250);
  };

  return (
    <div className="fixed top-16 right-3 bottom-3 z-40 w-80 sm:w-96 bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden text-white font-sans pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/70">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono text-cyan-300 tracking-wider">
              COPILOTE TACTIQUE // NEXUS-AI
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Orchestrateur & Télémétrie
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Fermer la console du copilote"
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Command Chips */}
      <div className="p-2 border-b border-slate-800/80 bg-slate-900/40 overflow-x-auto">
        <span className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase">
          Ordres tactiques rapides :
        </span>
        <div className="flex flex-wrap gap-1">
          {PRESET_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[10px] font-mono px-2 py-1 rounded-md bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-slate-300 transition-all text-left"
            >
              › {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl max-w-[85%] ${
                m.sender === 'user'
                  ? 'bg-cyan-600 text-white font-medium rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none font-mono text-[11px] leading-relaxed'
              }`}
            >
              {m.text}

              {m.action && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center gap-1 text-[10px] text-cyan-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Action exécutée : {m.action.type}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Console */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputVal);
        }}
        className="p-2.5 border-t border-slate-800 bg-slate-900/80 flex items-center gap-1.5"
      >
        <input
          type="text"
          placeholder="Ex: Quels agents sont bloqués ?"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          aria-label="Envoyer l'ordre au copilote"
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
