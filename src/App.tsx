import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WorldScene } from './scene/WorldScene.ts';
import { soundFx } from './scene/audioFeedback.ts';
import {
  POLES,
  getInitialAgents,
  getInitialProjects,
  getInitialDataFlows,
  getInitialSystemEvents,
  computeSystemTelemetry,
  updateAgentState,
  assignNewMission,
} from './simulation/agentModel.ts';
import type {
  Agent,
  AgentState,
  PoleId,
  ViewMode,
  ZoomLevel,
  Project,
  DataFlowConnection,
  SystemEvent,
} from './types/world.ts';

import { TopCommandBar } from './components/TopCommandBar.tsx';
import { CommandSidebar } from './components/CommandSidebar.tsx';
import { ControlDock } from './components/ControlDock.tsx';
import { AgentInspectorHUD } from './components/AgentInspectorHUD.tsx';
import { PoleModal } from './components/PoleModal.tsx';
import { MissionLaunchModal } from './components/MissionLaunchModal.tsx';
import { DataFlowInspectorHUD } from './components/DataFlowInspectorHUD.tsx';
import { CopilotConsole } from './components/CopilotConsole.tsx';
import { LegendModal } from './components/LegendModal.tsx';
import { FPSOverlay } from './components/FPSOverlay.tsx';
import { SimsBottomBar } from './components/SimsBottomBar.tsx';
import { AgentActionWheel } from './components/AgentActionWheel.tsx';
import { PipelineManagerModal } from './components/PipelineManagerModal.tsx';
import { EcosystemSettingsModal } from './components/EcosystemSettingsModal.tsx';
import { AgentOpsConsoleModal } from './components/AgentOpsConsoleModal.tsx';
import { CEODispatchModal } from './components/CEODispatchModal.tsx';
import {
  INITIAL_PIPELINES,
  DEFAULT_ECOSYSTEM_SETTINGS,
  INITIAL_AGENT_OPS_TRACES,
  computeAgentOpsMetrics,
} from './simulation/pipelineEngine.ts';
import type { MultiAgentPipeline, EcosystemSettings, AgentOpsTrace } from './types/pipeline.ts';
import type { CEODirectivePreset, CEODispatchedTask } from './types/dispatch.ts';

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<WorldScene | null>(null);

  // Core Simulation & Multiverse State
  const [agents, setAgents] = useState<Agent[]>(getInitialAgents);
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [dataFlows, setDataFlows] = useState<DataFlowConnection[]>(getInitialDataFlows);
  const [events, setEvents] = useState<SystemEvent[]>(getInitialSystemEvents);

  // Modes & Viewports
  const [viewMode, setViewMode] = useState<ViewMode>('spatial');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('overworld');

  // Active selections
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [followedAgentId, setFollowedAgentId] = useState<string | null>(null);
  const [selectedPoleId, setSelectedPoleId] = useState<PoleId | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  // FPS Mode State
  const [isFPSMode, setIsFPSMode] = useState<boolean>(false);
  const [fpsAgentName, setFpsAgentName] = useState<string>('');
  const [fpsLocationName, setFpsLocationName] = useState<string>('Agora Centrale & Espace Café Lounge');

  // UI Panels & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState<boolean>(false);
  const [missionModalAgentId, setMissionModalAgentId] = useState<string | undefined>(undefined);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // Ecosystem & Multi-Agent Pipelines State
  const [pipelines, setPipelines] = useState<MultiAgentPipeline[]>(INITIAL_PIPELINES);
  const [activePipelineId, setActivePipelineId] = useState<string>(INITIAL_PIPELINES[0].id);
  const [ecosystemSettings, setEcosystemSettings] = useState<EcosystemSettings>(DEFAULT_ECOSYSTEM_SETTINGS);
  const [agentOpsTraces, setAgentOpsTraces] = useState<AgentOpsTrace[]>(INITIAL_AGENT_OPS_TRACES);

  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAgentOpsModalOpen, setIsAgentOpsModalOpen] = useState<boolean>(false);
  const [isCEODispatchOpen, setIsCEODispatchOpen] = useState<boolean>(false);

  // Ref to agents to avoid scene re-creation
  const agentsRef = useRef(agents);
  agentsRef.current = agents;

  const handleEnterFPS = useCallback((agentId: string) => {
    soundFx.playInspect();
    sceneRef.current?.enterFPSMode(agentId);
  }, []);

  const handleExitFPS = useCallback(() => {
    soundFx.playClick();
    sceneRef.current?.exitFPSMode();
  }, []);

  const handleFollowAgent = useCallback((agentId: string) => {
    soundFx.playInspect();
    if (followedAgentId === agentId) {
      sceneRef.current?.stopFollowAgent();
      setFollowedAgentId(null);
    } else {
      sceneRef.current?.startFollowAgent(agentId);
      setFollowedAgentId(agentId);
      setSelectedAgentId(agentId);
    }
  }, [followedAgentId]);

  const handleStopFollow = useCallback(() => {
    soundFx.playClick();
    sceneRef.current?.stopFollowAgent();
    setFollowedAgentId(null);
  }, []);

  // Initialize Three.js Scene Engine once
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new WorldScene(
      mountRef.current,
      agentsRef.current,
      dataFlows,
      projects,
      {
        onSelectAgent: (agentId) => {
          soundFx.playInspect();
          setSelectedAgentId(agentId);
          setSelectedPoleId(null);
          setSelectedFlowId(null);
        },
        onSelectPole: (poleId) => {
          soundFx.playClick();
          setSelectedPoleId(poleId);
          setSelectedAgentId(null);
          setSelectedFlowId(null);
        },
        onSelectDataFlow: (flowId) => {
          soundFx.playInspect();
          setSelectedFlowId(flowId);
          setSelectedAgentId(null);
          setSelectedPoleId(null);
        },
        onSelectProject: (projId) => {
          soundFx.playClick();
          const proj = projects.find((p) => p.id === projId);
          if (proj) {
            setSelectedPoleId(proj.districtId);
            scene.focusOnPole(proj.districtId);
          }
        },
        onCanvasClickEmpty: () => {
          setSelectedAgentId(null);
          setSelectedPoleId(null);
          setSelectedFlowId(null);
        },
        onCameraLevelChange: (lvl) => {
          setZoomLevel(lvl);
        },
        onFPSModeChange: (isActive, agentName, locationName) => {
          setIsFPSMode(isActive);
          setFpsAgentName(agentName);
          setFpsLocationName(locationName);
        },
        onFPSLocationChange: (locationName) => {
          setFpsLocationName(locationName);
        },
        onFollowAgentChange: (agentId) => {
          setFollowedAgentId(agentId);
        },
      }
    );

    sceneRef.current = scene;

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (sceneRef.current?.getIsFPSMode()) {
          sceneRef.current.exitFPSMode();
          return;
        }
        if (sceneRef.current?.getFollowedAgentId()) {
          sceneRef.current.stopFollowAgent();
          setFollowedAgentId(null);
          return;
        }
        setSelectedAgentId(null);
        setSelectedPoleId(null);
        setSelectedFlowId(null);
        setIsMissionModalOpen(false);
        setIsLegendOpen(false);
        setIsCopilotOpen(false);
        setIsPipelineModalOpen(false);
        setIsSettingsModalOpen(false);
        setIsAgentOpsModalOpen(false);
      } else if (e.key === 'h' || e.key === 'H') {
        setIsDockCollapsed((prev) => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        if (document.activeElement?.tagName !== 'INPUT') {
          setIsCopilotOpen((prev) => !prev);
        }
      } else if ((e.key === 'f' || e.key === 'F') && document.activeElement?.tagName !== 'INPUT') {
        if (sceneRef.current?.getIsFPSMode()) {
          sceneRef.current.exitFPSMode();
        } else if (selectedAgentId) {
          sceneRef.current?.enterFPSMode(selectedAgentId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Responsive viewport resize listener
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Update Three.js view modes
  useEffect(() => {
    sceneRef.current?.setViewMode(viewMode);
  }, [viewMode]);

  // Sync Label Visibility
  useEffect(() => {
    sceneRef.current?.setShowLabels(showLabels);
  }, [showLabels]);

  // Actions
  const handleSelectAgent = (agentId: string) => {
    soundFx.playInspect();
    setSelectedAgentId(agentId);
    setSelectedPoleId(null);
    sceneRef.current?.focusOnAgent(agentId);
    sceneRef.current?.setSelectedAgent(agentId);
  };

  const handleSetSimSpeed = (speed: number) => {
    soundFx.playClick();
    setSimSpeed(speed);
    sceneRef.current?.setSimSpeed(speed);
  };

  const handleSetIsometricView = () => {
    soundFx.playClick();
    setFollowedAgentId(null);
    sceneRef.current?.setSimsIsometricView();
  };

  const logAgentAction = (
    agentId: string,
    actionDesc: string,
    newTask: string,
    severity: 'info' | 'success' | 'warning' = 'info'
  ) => {
    const ag = agents.find((a) => a.id === agentId);
    if (!ag) return;
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        type: 'status_changed',
        agentId: ag.id,
        districtId: ag.poleId,
        description: actionDesc,
        severity,
      },
      ...prev.slice(0, 50),
    ]);
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, currentTask: newTask, lastActivity: 'À l’instant' } : a))
    );
  };

  const handleSendToDesk = (agentId: string) => {
    soundFx.playClick();
    const ag = agents.find((a) => a.id === agentId);
    logAgentAction(agentId, `${ag?.name || 'Agent'} retourne à son bureau pour travailler`, 'Travail au bureau', 'info');
    sceneRef.current?.sendAgentToDesk(agentId);
  };

  const handleSendToCoffee = (agentId: string) => {
    soundFx.playClick();
    const ag = agents.find((a) => a.id === agentId);
    logAgentAction(agentId, `${ag?.name || 'Agent'} prend une pause au Barista Espresso`, 'Pause Café Espresso ☕', 'success');
    sceneRef.current?.sendAgentToCoffee(agentId);
  };

  const handleSendToMeeting = (agentId: string) => {
    soundFx.playClick();
    const ag = agents.find((a) => a.id === agentId);
    logAgentAction(agentId, `${ag?.name || 'Agent'} rejoint la réunion d’équipe`, 'Point Réunion Stratégique 🤝', 'info');
    sceneRef.current?.sendAgentToMeeting(agentId);
  };

  const handleSendToLounge = (agentId: string) => {
    soundFx.playClick();
    const ag = agents.find((a) => a.id === agentId);
    logAgentAction(agentId, `${ag?.name || 'Agent'} s’installe dans le salon lounge`, 'Détente & brainstorming 🛋️', 'info');
    sceneRef.current?.sendAgentToLounge(agentId);
  };

  const handleSendToServers = (agentId: string) => {
    soundFx.playClick();
    const ag = agents.find((a) => a.id === agentId);
    logAgentAction(agentId, `${ag?.name || 'Agent'} inspecte la baie de serveurs et les clusters GPU`, 'Audit Serveurs & GPU ⚡', 'warning');
    sceneRef.current?.sendAgentToServers(agentId);
  };

  const handleCheerThought = (agentId: string, emoji: string, text: string) => {
    soundFx.playSuccess();
    sceneRef.current?.setAgentThought(agentId, emoji, text);
    const ag = agents.find((a) => a.id === agentId);
    if (ag) {
      logAgentAction(agentId, `${ag.name} exprime une pensée : "${text}" ${emoji}`, text, 'success');
    }
  };

  // =========================================================================
  // ECOSYSTEM PIPELINE ORCHESTRATION HANDLERS
  // =========================================================================
  const handleStartPipeline = (pipeId: string) => {
    soundFx.playClick();
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id !== pipeId) return p;
        const updatedSteps = [...p.steps];
        if (updatedSteps[p.currentStepIndex]) {
          updatedSteps[p.currentStepIndex] = {
            ...updatedSteps[p.currentStepIndex],
            status: 'running',
            startedAt: new Date().toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          };
        }
        return {
          ...p,
          status: 'running',
          steps: updatedSteps,
        };
      })
    );
  };

  const handlePausePipeline = (pipeId: string) => {
    soundFx.playClick();
    setPipelines((prev) =>
      prev.map((p) => (p.id === pipeId ? { ...p, status: 'paused' } : p))
    );
  };

  const handleAdvancePipelineStep = useCallback((pipeId: string) => {
    soundFx.playSuccess();
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id !== pipeId) return p;
        const curIdx = p.currentStepIndex;
        if (curIdx >= p.steps.length) return p;

        const updatedSteps = [...p.steps];
        const completedStep = updatedSteps[curIdx];
        const nowStr = new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        // 1. Complete current step
        updatedSteps[curIdx] = {
          ...completedStep,
          status: 'completed',
          finishedAt: nowStr,
        };

        const nextIdx = curIdx + 1;
        const isDone = nextIdx >= p.steps.length;

        // 2. Prepare next step or finish
        if (!isDone) {
          updatedSteps[nextIdx] = {
            ...updatedSteps[nextIdx],
            status: 'running',
            startedAt: nowStr,
          };

          const nextStep = updatedSteps[nextIdx];
          logAgentAction(
            nextStep.agentId,
            `Workflow [${p.name}] : Réception du livrable "${completedStep.artifact?.title || 'spécification'}" ➔ Début de "${nextStep.title}"`,
            nextStep.title,
            'info'
          );
          sceneRef.current?.sendAgentToDesk(nextStep.agentId);
        } else {
          logAgentAction(
            completedStep.agentId,
            `🎉 Pipeline [${p.name}] finalisé avec succès ! Tous les livrables validés.`,
            'Pipeline validé ✓',
            'success'
          );
        }

        // 3. Log to AgentOps traces
        setAgentOpsTraces((traces) => [
          {
            id: `trace-${Date.now()}`,
            timestamp: nowStr,
            agentId: completedStep.agentId,
            agentName: completedStep.agentName,
            poleId: completedStep.poleId,
            pipelineName: p.name,
            stepTitle: completedStep.title,
            thought: completedStep.reasoningTrace?.thought || `Validation de l’étape : ${completedStep.title}`,
            toolUsed: completedStep.reasoningTrace?.tool || 'DAGRunner.transferPayload()',
            observation: completedStep.reasoningTrace?.observation || 'Livrable produit et transmis à l’étape suivante.',
            tokens: completedStep.tokensUsed,
            durationMs: completedStep.latencyMs,
            status: 'success',
          },
          ...traces.slice(0, 50),
        ]);

        const progress = Math.min(100, (nextIdx / p.steps.length) * 100);

        return {
          ...p,
          currentStepIndex: nextIdx,
          overallProgress: progress,
          status: isDone ? 'completed' : 'running',
          steps: updatedSteps,
        };
      })
    );
  }, []);

  const handleResetPipeline = (pipeId: string) => {
    soundFx.playClick();
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id !== pipeId) return p;
        return {
          ...p,
          status: 'idle',
          currentStepIndex: 0,
          overallProgress: 0,
          steps: p.steps.map((s) => ({ ...s, status: 'pending' })),
        };
      })
    );
  };

  const handleExecuteCEODispatch = useCallback(
    (directive: CEODirectivePreset, tasks: CEODispatchedTask[]) => {
      soundFx.playSuccess();
      const nowStr = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // 1. Update target agents & CEO in state
      setAgents((prev) =>
        prev.map((ag) => {
          const assigned = tasks.find((t) => t.agentId === ag.id);
          if (assigned) {
            const updatedLogs = [
              `[CEO DIRECTIVE] Assignation reçue : ${assigned.task}`,
              `[DELIVERABLE TARGET] ${assigned.deliverable}`,
              ...ag.logStream.slice(0, 5),
            ];
            return {
              ...ag,
              currentTask: assigned.task,
              status: 'working' as AgentState,
              progress: 18,
              lastActivity: 'À l’instant',
              cpuLoad: 82,
              logStream: updatedLogs,
            };
          }
          if (ag.id === 'ceo-orchestrator') {
            const updatedLogs = [
              `[CEO DISPATCH] Directive « ${directive.title} » déployée aux 4 pôles`,
              `[ORCHESTRATION] ${tasks.length} missions actives synchronisées`,
              ...ag.logStream.slice(0, 5),
            ];
            return {
              ...ag,
              currentTask: `Orchestration : ${directive.title}`,
              status: 'working' as AgentState,
              lastActivity: 'À l’instant',
              progress: 95,
              cpuLoad: 68,
              logStream: updatedLogs,
            };
          }
          return ag;
        })
      );

      // 2. 3D World Scene Feedback (Thought Bubbles)
      sceneRef.current?.setAgentThought('ceo-orchestrator', '👑', 'Dispatch envoyé !');
      tasks.forEach((t) => {
        sceneRef.current?.setAgentThought(t.agentId, '⚡', 'Ordre reçu !');
      });

      // 3. System Event in Activity Log
      const newEvent: SystemEvent = {
        id: `ev-ceo-${Date.now()}`,
        timestamp: nowStr,
        type: 'deploy_completed',
        districtId: 'personnel',
        agentId: 'ceo-orchestrator',
        description: `[CEO DISPATCH] Directive « ${directive.title} » déployée sur ${tasks.length} pôles`,
        severity: 'success',
      };
      setEvents((prev) => [newEvent, ...prev.slice(0, 45)]);

      // 4. AgentOps Observability Trace
      const ceoTrace: AgentOpsTrace = {
        id: `trace-ceo-${Date.now()}`,
        timestamp: nowStr,
        agentId: 'ceo-orchestrator',
        agentName: 'Aura (CEO)',
        poleId: 'personnel',
        pipelineName: directive.title,
        stepTitle: 'Décomposition Stratégique & Dispatch Multi-Pôles',
        thought: `Analyse des dépendances globales et allocation des priorités pour la directive : ${directive.title}`,
        toolUsed: 'LLMStrategicRouter.dispatchDirectives()',
        observation: `${tasks.length} sous-tâches validées et synchronisées vers les terminaux des agents.`,
        tokens: 2180,
        durationMs: 440,
        status: 'success',
      };
      setAgentOpsTraces((prev) => [ceoTrace, ...prev]);

      // 5. Connect matching Pipeline if exists
      if (directive.matchingPipelineId) {
        setActivePipelineId(directive.matchingPipelineId);
        setPipelines((prev) =>
          prev.map((pipe) => {
            if (pipe.id !== directive.matchingPipelineId) return pipe;
            return {
              ...pipe,
              status: 'running',
              currentStepIndex: 0,
            };
          })
        );
      }
    },
    []
  );

  const handleFocusCEO = useCallback(() => {
    soundFx.playInspect();
    setIsCEODispatchOpen(false);
    setSelectedAgentId('ceo-orchestrator');
    sceneRef.current?.focusOnAgent('ceo-orchestrator', true);
  }, []);

  // Pipeline automated interval advancement when running
  useEffect(() => {
    const runningPipe = pipelines.find((p) => p.status === 'running');
    if (!runningPipe || simSpeed === 0) return;

    const delay = Math.max(1200, 3200 / simSpeed);
    const timer = setTimeout(() => {
      handleAdvancePipelineStep(runningPipe.id);
    }, delay);

    return () => clearTimeout(timer);
  }, [pipelines, simSpeed, handleAdvancePipelineStep]);

  const handleSelectPole = (poleId: PoleId) => {
    soundFx.playClick();
    setSelectedPoleId(poleId);
    setSelectedAgentId(null);
    sceneRef.current?.focusOnPole(poleId);
  };

  const handleEnterInterior = (poleId: PoleId) => {
    soundFx.playClick();
    setSelectedPoleId(poleId);
    sceneRef.current?.enterDistrictInterior(poleId);
  };

  const handleResetView = () => {
    soundFx.playClick();
    setSelectedAgentId(null);
    setFollowedAgentId(null);
    setSelectedPoleId(null);
    setSelectedFlowId(null);
    sceneRef.current?.resetView();
  };

  const handleToggleMute = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleToggleLabels = () => {
    soundFx.playClick();
    setShowLabels((prev) => !prev);
  };

  // State Updates from UI Modals
  const handleUpdateAgentStatus = (agentId: string, newState: AgentState) => {
    soundFx.playSuccess();
    setAgents((prev) => updateAgentState(prev, agentId, newState));
    // Emit new system event
    const targetAgent = agents.find((a) => a.id === agentId);
    if (targetAgent) {
      setEvents((prev) => [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          type: 'status_changed',
          agentId: targetAgent.id,
          districtId: targetAgent.poleId,
          description: `État mis à jour vers [${newState.toUpperCase()}]`,
          severity: newState === 'error' ? 'error' : newState === 'review' ? 'warning' : 'info',
        },
        ...prev.slice(0, 40),
      ]);
    }
  };

  const handleLaunchMission = (
    agentId: string,
    title: string,
    projectName: string,
    priority: 'standard' | 'high' | 'critical',
    initialStatus: AgentState = 'working'
  ) => {
    soundFx.playSuccess();
    setAgents((prev) => assignNewMission(prev, agentId, title, initialStatus));

    // Emit event
    const agent = agents.find((a) => a.id === agentId);
    if (agent) {
      setEvents((prev) => [
        {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          type: 'task_created',
          agentId: agent.id,
          districtId: agent.poleId,
          description: `Mission déployée [${priority.toUpperCase()}] : ${title}`,
          severity: 'success',
        },
        ...prev.slice(0, 40),
      ]);
    }
  };

  // Copilot Query Handler
  const handleCopilotAction = (action?: {
    type: 'FOCUS_DISTRICT' | 'SELECT_AGENT' | 'SET_VIEW_MODE' | 'RESET_VIEW' | 'FILTER_STATUS';
    targetId?: string;
    viewMode?: ViewMode;
    filterStatus?: AgentState;
  }) => {
    if (!action) return;
    if (action.type === 'SELECT_AGENT' && action.targetId) {
      handleSelectAgent(action.targetId);
    } else if (action.type === 'FOCUS_DISTRICT' && action.targetId) {
      handleSelectPole(action.targetId as PoleId);
    } else if (action.type === 'RESET_VIEW') {
      handleResetView();
    } else if (action.type === 'SET_VIEW_MODE' && action.viewMode) {
      setViewMode(action.viewMode);
    }
  };

  // Lookup selections
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || null;
  const selectedPole = POLES.find((p) => p.id === selectedPoleId) || null;
  const selectedFlow = dataFlows.find((f) => f.id === selectedFlowId) || null;

  // Real-time computed system health
  const telemetry = computeSystemTelemetry(agents);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* 3D WebGL Canvas Viewport (100% full screen) */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        aria-label="Campus 3D immersif interactif - Immeuble de Bureaux"
      />

      {/* FIRST-PERSON (FPS) MODE OVERLAY */}
      {isFPSMode && (
        <FPSOverlay
          agent={agents.find((a) => a.id === (sceneRef.current?.['fpsAgentId'] || selectedAgentId)) || selectedAgent}
          locationName={fpsLocationName}
          onExitFPS={handleExitFPS}
        />
      )}

      {/* TOP COMMAND BAR (Game HUD with Clock, Speed Controls, Camera Switches) */}
      {!isFPSMode && (
        <TopCommandBar
          systemTelemetry={telemetry}
          viewMode={viewMode}
          onViewModeChange={(m) => {
            soundFx.playClick();
            setViewMode(m);
          }}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          showLabels={showLabels}
          onToggleLabels={handleToggleLabels}
          onResetView={handleResetView}
          simSpeed={simSpeed}
          onSetSimSpeed={handleSetSimSpeed}
          onSetIsometricView={handleSetIsometricView}
          followedAgentName={agents.find((a) => a.id === followedAgentId)?.name || null}
          onStopFollow={handleStopFollow}
          onOpenPipelines={() => {
            soundFx.playClick();
            setIsPipelineModalOpen(true);
          }}
          isPipelineRunning={pipelines.some((p) => p.status === 'running')}
          onOpenSettings={() => {
            soundFx.playClick();
            setIsSettingsModalOpen(true);
          }}
          onOpenAgentOps={() => {
            soundFx.playClick();
            setIsAgentOpsModalOpen(true);
          }}
          onOpenCEODispatch={() => {
            soundFx.playClick();
            setIsCEODispatchOpen(true);
          }}
        />
      )}

      {/* SIMS CHARACTER BOTTOM ROSTER BAR (Always accessible, non-blocking) */}
      {!isFPSMode && (
        <SimsBottomBar
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={handleSelectAgent}
          onEnterFPS={handleEnterFPS}
          onFollowAgent={handleFollowAgent}
          followedAgentId={followedAgentId}
          events={events}
          onSendToDesk={handleSendToDesk}
          onSendToCoffee={handleSendToCoffee}
          onSendToMeeting={handleSendToMeeting}
          onSendToLounge={handleSendToLounge}
          onSendToServers={handleSendToServers}
          onOpenCEODispatch={() => {
            soundFx.playClick();
            setIsCEODispatchOpen(true);
          }}
        />
      )}

      {/* SIMS 1-CLICK ACTION WHEEL (Direct Agent Orders: Desk, Coffee, Meeting, Lounge, Servers, FPS, Follow, Mood Boosts) */}
      {!isFPSMode && selectedAgent && (
        <AgentActionWheel
          agent={selectedAgent}
          onClose={() => {
            setSelectedAgentId(null);
            sceneRef.current?.setSelectedAgent(null);
          }}
          onSendToDesk={handleSendToDesk}
          onSendToCoffee={handleSendToCoffee}
          onSendToMeeting={handleSendToMeeting}
          onSendToLounge={handleSendToLounge}
          onSendToServers={handleSendToServers}
          onEnterFPS={handleEnterFPS}
          onFollowAgent={handleFollowAgent}
          isFollowed={followedAgentId === selectedAgent.id}
          onCheerThought={handleCheerThought}
        />
      )}

      {/* FLOATING WORKSPACE HUB: Agent Holographic Inspector (Non-blocking, Draggable, Resizable, Minimizable) */}
      {!isFPSMode && (
        <AgentInspectorHUD
          agent={selectedAgent}
          onClose={() => setSelectedAgentId(null)}
          onUpdateStatus={handleUpdateAgentStatus}
          onAssignTask={(id, title, st) =>
            handleLaunchMission(id, title, selectedAgent?.project || projects[0].name, 'high', st || 'working')
          }
          onFocusAgent={(id) => sceneRef.current?.focusOnAgent(id)}
          onOpenNewMission={(id) => {
            setMissionModalAgentId(id);
            setIsMissionModalOpen(true);
          }}
          onEnterFPS={handleEnterFPS}
        />
      )}

      {/* District / Pole Overview Modal */}
      <PoleModal
        pole={selectedPole}
        agents={agents}
        onClose={() => setSelectedPoleId(null)}
        onSelectAgent={handleSelectAgent}
        onFocusPole={(id) => sceneRef.current?.focusOnPole(id)}
        onEnterInterior={handleEnterInterior}
      />

      {/* FlightRadar Data Flow Inspector HUD */}
      <DataFlowInspectorHUD
        flow={selectedFlow}
        onClose={() => setSelectedFlowId(null)}
        agents={agents}
        poles={POLES}
        onSelectAgent={handleSelectAgent}
      />

      {/* Tactical Copilot Console Drawer */}
      <CopilotConsole
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        agents={agents}
        projects={projects}
        onExecuteAction={handleCopilotAction}
      />

      {/* Mission Launch Console Modal */}
      <MissionLaunchModal
        isOpen={isMissionModalOpen}
        agents={agents}
        projects={projects}
        poles={POLES}
        defaultAgentId={missionModalAgentId}
        onClose={() => setIsMissionModalOpen(false)}
        onLaunchMission={handleLaunchMission}
      />

      {/* Operations Legend & Guide Modal */}
      <LegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />

      {/* MULTI-AGENT PIPELINE ORCHESTRATOR MODAL (Workflows DAG) */}
      <PipelineManagerModal
        isOpen={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
        pipelines={pipelines}
        activePipelineId={activePipelineId}
        onSelectPipeline={(id) => setActivePipelineId(id)}
        onStartPipeline={handleStartPipeline}
        onPausePipeline={handlePausePipeline}
        onAdvanceStep={handleAdvancePipelineStep}
        onResetPipeline={handleResetPipeline}
        onFocusAgent={(agId) => {
          setIsPipelineModalOpen(false);
          handleSelectAgent(agId);
        }}
      />

      {/* ECOSYSTEM GOVERNANCE & SETTINGS MODAL */}
      <EcosystemSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={ecosystemSettings}
        onUpdateSettings={(newSt) => {
          soundFx.playSuccess();
          setEcosystemSettings(newSt);
        }}
      />

      {/* AGENTOPS OBSERVABILITY & REASONING TRACES CONSOLE */}
      <AgentOpsConsoleModal
        isOpen={isAgentOpsModalOpen}
        onClose={() => setIsAgentOpsModalOpen(false)}
        metrics={computeAgentOpsMetrics(pipelines, agentOpsTraces)}
        traces={agentOpsTraces}
        onSelectAgent={(agId) => {
          setIsAgentOpsModalOpen(false);
          handleSelectAgent(agId);
        }}
      />

      {/* CEO STRATEGIC ORCHESTRATOR & DISPATCH CONSOLE */}
      <CEODispatchModal
        isOpen={isCEODispatchOpen}
        onClose={() => setIsCEODispatchOpen(false)}
        agents={agents}
        onExecuteDispatch={handleExecuteCEODispatch}
        onFocusCEO={handleFocusCEO}
      />
    </div>
  );
}
