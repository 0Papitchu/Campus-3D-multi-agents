import type { Agent, AgentState } from '../types/world.ts';
export {
  POLES,
  INITIAL_AGENTS,
  INITIAL_PROJECTS,
  INITIAL_DATA_FLOWS,
  INITIAL_SYSTEM_EVENTS,
  getInitialAgents,
  getInitialProjects,
  getInitialDataFlows,
  getInitialSystemEvents,
  computeSystemTelemetry,
  updateAgentState,
  assignNewMission,
  processCopilotQuery,
} from './dataEngine.ts';

export const SUGGESTED_TASKS_BY_AGENT: Record<string, string[]> = {
  'tech-dev-ia': [
    'Compiler les shaders WebGL et optimiser l’arbre d’interaction',
    'Optimiser la boucle d’orchestration des agents',
    'Auditer le temps de réponse des micro-services',
    'Déployer la mise à jour WASM sur le cluster GPU',
  ],
  'tech-veille': [
    'Évaluer le compromis latence/inférence des modèles multimodaux',
    'Comparer des solutions d’hébergement distribué',
    'Rédiger une synthèse sur les agents autonomes',
    'Tester l’inférence locale sur puce NPU embarquée',
  ],
  'carole-styliste': [
    'Valider la gamme chromatique Terre de Sienne & Nacre',
    'Créer une sélection de matières haute couture',
    'Finaliser les drapés du catalogue virtuel',
    'Sélectionner les finitions de velours côtelé bio',
  ],
  'carole-tendances': [
    'Indexer 150 échantillons de lin biologique et velours côtelé',
    'Préparer un moodboard printemps 2027',
    'Analyser les textures en vogue au salon de Milan',
    'Recenser les teintes éco-responsables de l’année',
  ],
  'contenu-script': [
    'Script finalisé : « L’univers des agents IA en 45 secondes »',
    'Proposer 5 accroches virales pour la vidéo récap',
    'Structurer l’interview du prochain épisode',
    'Rédiger le conducteur du direct multidiffusé',
  ],
  'contenu-montage': [
    'Calcul du rendu avec sous-titres cinétiques et transitions audio',
    'Préparer une première version du montage vertical',
    'Ajouter les sous-titres animés et bruitages',
    'Exporter les déclinaisons TikTok et Instagram Reels',
  ],
  'perso-assistant': [
    'Synchroniser les priorités des 4 pôles pour l’arbitrage du soir',
    'Bloquer 2 créneaux de Deep Work pour demain',
    'Organiser les tâches de la semaine',
    'Trier les flux d’information et résumer les urgences',
  ],
  'perso-organisateur': [
    'Chevauchement détecté sur la réservation du cluster GPU',
    'Résoudre le conflit de créneau de calcul avec le Pôle Tech',
    'Préparer le planning de demain',
    'Vérifier les alertes de facturation cloud',
  ],
  'ceo-orchestrator': [
    'Dispatcher la directive Produit V2 aux 4 pôles',
    'Arbitrer l’allocation des ressources GPU entre Tech et Média',
    'Lancer une campagne de capsules courtes synchronisée',
    'Superviser la cadence opérationnelle globale du campus',
  ],
};

export function assignNewTask(
  agents: Agent[],
  agentId: string,
  taskDescription: string,
  initialState: AgentState = 'working'
): Agent[] {
  return agents.map((agent) => {
    if (agent.id !== agentId) return agent;
    return {
      ...agent,
      currentTask: taskDescription.trim() || agent.currentTask,
      status: initialState,
      lastActivity: 'À l’instant',
      progress: initialState === 'done' ? 100 : 15,
      cpuLoad: 75,
    };
  });
}

export function getAgentsByPole(agents: Agent[], poleId: string): Agent[] {
  return agents.filter((a) => a.poleId === poleId);
}
