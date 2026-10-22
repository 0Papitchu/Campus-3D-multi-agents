import type { CEODirectivePreset, CEODispatchedTask } from '../types/dispatch.ts';

export const CEO_DIRECTIVE_PRESETS: CEODirectivePreset[] = [
  {
    id: 'dir-launch-v2',
    title: 'Lancement Produit V2 (Web3D & Expérience Visuelle)',
    category: 'Innovation Produit & Release',
    badge: 'Priorité Q2',
    color: '#00f0ff',
    objective:
      'Coordonner le déploiement de la version 2.0 : moteur de rendu WebGL temps réel, nouvelle identité de marque haute couture et diffusion virale synchronisée.',
    matchingPipelineId: 'pipe-sprint-ia',
    tasks: [
      {
        poleId: 'tech',
        agentId: 'tech-dev-ia',
        task: 'Compiler et optimiser les shaders WebGL GLSL pour garantir 60 FPS sur mobile',
        deliverable: 'Bundle WASM optimisé & benchmarks 60 FPS',
        priority: 'urgent',
      },
      {
        poleId: 'carole',
        agentId: 'carole-styliste',
        task: 'Finaliser la palette de textures photoréalistes et valider le moodboard spatial',
        deliverable: 'Asset pack PBR haute résolution & guide chromatique',
        priority: 'high',
      },
      {
        poleId: 'contenu',
        agentId: 'contenu-script',
        task: 'Rédiger le script du trailer reveal 45s avec 3 hooks à fort taux de rétention',
        deliverable: 'Script timé + voix ElevenLabs prête pour mixage',
        priority: 'high',
      },
      {
        poleId: 'personnel',
        agentId: 'perso-organisateur',
        task: 'Réserver les instances GPU de calcul et caler le créneau de release sans collision',
        deliverable: 'Verrou de ressources cloud & calendrier de diffusion',
        priority: 'normal',
      },
    ],
  },
  {
    id: 'dir-viral-campaign',
    title: 'Campagne Virale Mode Digitale (TikTok & Reels)',
    category: 'Acquisition & Média',
    badge: 'Croissance',
    color: '#fb7185',
    objective:
      'Diffuser une série de capsules courtes mettant en valeur les créations numériques avec animation cinétique et narration dynamique.',
    matchingPipelineId: 'pipe-media-viral',
    tasks: [
      {
        poleId: 'carole',
        agentId: 'carole-tendances',
        task: 'Extraire les 5 micro-tendances streetwear cybernétiques du salon de Milan',
        deliverable: 'Moodboard de tendances validé avec 12 références visuelles',
        priority: 'urgent',
      },
      {
        poleId: 'contenu',
        agentId: 'contenu-script',
        task: 'Rédiger 3 variations de scripts pour format vertical 9:16 avec hook percutant',
        deliverable: '3 storyboards textuels avec timecodes audio',
        priority: 'urgent',
      },
      {
        poleId: 'contenu',
        agentId: 'contenu-montage',
        task: 'Assembler le rush 3D avec sous-titres cinétiques, transitions audio et colorimétrie',
        deliverable: '3 vidéos verticales 1080x1920 prêtes pour diffusion',
        priority: 'high',
      },
      {
        poleId: 'tech',
        agentId: 'tech-veille',
        task: 'Surveiller les métriques de diffusion en temps réel et optimiser le CDN',
        deliverable: 'Rapport de télémétrie réseau et taux d’engagement',
        priority: 'normal',
      },
    ],
  },
  {
    id: 'dir-gpu-audit',
    title: 'Optimisation Coûts & Audit Performance Campus',
    category: 'Gouvernance & Efficience',
    badge: 'Économie Cloud',
    color: '#34d399',
    objective:
      'Éliminer les goulots d’étranglement de calcul, réduire la facture d’API cloud et sanctuariser les plages de travail des agents.',
    matchingPipelineId: 'pipe-infra-audit',
    tasks: [
      {
        poleId: 'personnel',
        agentId: 'perso-organisateur',
        task: 'Résoudre le conflit d’allocation de ressources GPU entre Tech Lab et Media Studio',
        deliverable: 'Protocole de verrouillage distribué sans collision',
        priority: 'urgent',
      },
      {
        poleId: 'tech',
        agentId: 'tech-dev-ia',
        task: 'Profiler la mémoire WebGL et implémenter le frustum culling sur les meshes',
        deliverable: 'Gain de 40% sur la charge mémoire GPU',
        priority: 'high',
      },
      {
        poleId: 'tech',
        agentId: 'tech-veille',
        task: 'Évaluer la faisabilité d’un modèle d’inférence local compact pour réduire les coûts API',
        deliverable: 'Matrice comparative coût/latence sur 10 000 requêtes',
        priority: 'high',
      },
      {
        poleId: 'personnel',
        agentId: 'perso-assistant',
        task: 'Réorganiser l’agenda hebdomadaire et préserver 3 blocs de Deep Work ininterrompus',
        deliverable: 'Agenda optimisé et synchronisé avec les 4 pôles',
        priority: 'normal',
      },
    ],
  },
  {
    id: 'dir-conf-investors',
    title: 'Démo Stratégique & Présentation Grand Compte',
    category: 'Direction Stratégique',
    badge: 'VIP',
    color: '#c084fc',
    objective:
      'Préparer une démonstration immersive et fluide du campus multi-agents pour les investisseurs et partenaires stratégiques.',
    tasks: [
      {
        poleId: 'tech',
        agentId: 'tech-dev-ia',
        task: 'Préparer un environnement de démo avec télémétrie temps réel et mode FPS stabilisé',
        deliverable: 'Scène 3D fluide sans accroc avec mode présentation actif',
        priority: 'urgent',
      },
      {
        poleId: 'carole',
        agentId: 'carole-styliste',
        task: 'Mettre en valeur les mannequins holographiques et ajuster les reflets lumineux',
        deliverable: 'Ambiance visuelle haut de gamme pour la démonstration',
        priority: 'high',
      },
      {
        poleId: 'contenu',
        agentId: 'contenu-montage',
        task: 'Préparer une boucle vidéo de fond avec les accomplissements majeurs du trimestre',
        deliverable: 'Vidéo teaser projetée sur l’écran de conférence',
        priority: 'high',
      },
      {
        poleId: 'personnel',
        agentId: 'perso-assistant',
        task: 'Rédiger l’executive summary et la roadmap de projection des 12 prochains mois',
        deliverable: 'Support de présentation stratégique 5 slides',
        priority: 'urgent',
      },
    ],
  },
];

/**
 * Intelligent decomposition of custom freeform directive into 4 domain tasks
 */
export function decomposeCustomDirective(prompt: string): CEODispatchedTask[] {
  const clean = prompt.trim() || 'Directive générale d’accélération campus';

  return [
    {
      id: `task-tech-${Date.now()}`,
      poleId: 'tech',
      agentId: 'tech-dev-ia',
      agentName: 'Dev IA',
      poleName: 'Pôle Tech',
      task: `Implémenter les composants techniques et adapter l'architecture logicielle pour : "${clean}"`,
      deliverable: 'Modules techniques validés et connectés au runtime',
      priority: 'high',
      status: 'dispatched',
    },
    {
      id: `task-carole-${Date.now()}`,
      poleId: 'carole',
      agentId: 'carole-styliste',
      agentName: 'Styliste & DA',
      poleName: 'Maison Carole',
      task: `Concevoir la charte visuelle, l'harmonie stylistique et les assets nécessaires pour : "${clean}"`,
      deliverable: 'Moodboard de design et spécifications esthétiques',
      priority: 'high',
      status: 'dispatched',
    },
    {
      id: `task-contenu-${Date.now()}`,
      poleId: 'contenu',
      agentId: 'contenu-script',
      agentName: 'Script vidéo',
      poleName: 'Pôle Contenu',
      task: `Scénariser le message, rédiger le contenu narratif et préparer la communication autour de : "${clean}"`,
      deliverable: 'Scripts, accroches et livrables de communication finalisés',
      priority: 'urgent',
      status: 'dispatched',
    },
    {
      id: `task-perso-${Date.now()}`,
      poleId: 'personnel',
      agentId: 'perso-assistant',
      agentName: 'Assistant quotidien',
      poleName: 'Pôle Personnel',
      task: `Planifier les étapes clés, coordonner les livrables entre pôles et arbitrer les priorités pour : "${clean}"`,
      deliverable: 'Calendrier d’exécution, élimination des blocages et arbitrage',
      priority: 'urgent',
      status: 'dispatched',
    },
  ];
}
