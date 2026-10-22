import type {
  Agent,
  Pole,
  AgentState,
  Project,
  DataFlowConnection,
  SystemEvent,
  SystemTelemetry,
} from '../types/world.ts';

export const POLES: Pole[] = [
  {
    id: 'tech',
    name: 'Pôle Tech — Engineering Lab',
    codeName: 'SECTOR-01 // LAB-QUANTUM',
    category: 'Ingénierie & Systèmes Quantiques',
    tagline: 'Laboratoire neural, clusters de calcul et orchestration logicielle',
    description:
      'Complexe de recherche haute intensité équipé de stations multi-moniteurs cybernétiques, de tours de calcul cryogéniques, de matrices de code holographique et de bancs de tests automatisés.',
    accentColor: '#38bdf8', // Sky 400
    bgGradient: 'from-sky-950/80 to-slate-900/95',
    centerCoords: { x: -9, z: -9 },
    cameraTarget: [-9, 1.2, -9],
    cameraPosition: [-16, 7.5, -2],
    interiorCameraTarget: [-9, 1.1, -9],
    interiorCameraPosition: [-11.5, 3.2, -6.5],
    operationalSector: 'Noyau d’inférence & Micro-services',
    activeModules: [
      'Orchestrateur Multi-Agents v4.2',
      'Compilateur WASM Shader',
      'Moniteur de Latence Télémétrique',
      'Cluster GPU Embarqué',
    ],
    features: [
      'Stations de dev holographiques doubles',
      'Rack serveurs & télémétrie en temps réel',
      'Matrice de code en streaming synchrone',
      'Terminal de diagnostic réseau',
    ],
  },
  {
    id: 'carole',
    name: 'Maison Carole — Creative House',
    codeName: 'SECTOR-02 // ATELIER-LUXE',
    category: 'Haute Création, Mode & Design Spatial',
    tagline: 'Atelier futuriste de prospective sensorielle et de design génératif',
    description:
      'Pavillon d’avant-garde alliant géométrie de cristal et matériaux nobles. Écrans d’échantillonnage spectral, moodboards holographiques interactifs, mannequin d’ajustement volumétrique et studio de rendus photoréalistes.',
    accentColor: '#fb7185', // Rose 400
    bgGradient: 'from-rose-950/80 to-stone-900/95',
    centerCoords: { x: 9, z: -9 },
    cameraTarget: [9, 1.2, -9],
    cameraPosition: [16, 7.5, -2],
    interiorCameraTarget: [9, 1.1, -9],
    interiorCameraPosition: [11.5, 3.2, -6.5],
    operationalSector: 'Direction Artistique & Identité de Marque',
    activeModules: [
      'Générateur de Palettes Chromatiques',
      'Moteur de Tissage Algorithmique',
      'Simulation de Drapés PBR',
      'Registre de Tendances Milan 2027',
    ],
    features: [
      'Mannequins cybernétiques & drapés adaptatifs',
      'Moodboard d’inspiration volumétrique',
      'Table de stylisme tactile en polymère',
      'Prisme de réfraction de textures',
    ],
  },
  {
    id: 'contenu',
    name: 'Pôle Contenu — Media Studio',
    codeName: 'SECTOR-03 // CYBER-BROADCAST',
    category: 'Production Audiovisuelle & Motion IA',
    tagline: 'Studio de diffusion multidimensionnel et régie de post-production',
    description:
      'Studio de capture volumétrique équipé de caméras cinéma montées sur rails gyroscopiques, d’éclairages de studio photoniques, d’un cyclorama d’incrustation vert dynamique et d’une console de montage à spectre complet.',
    accentColor: '#c084fc', // Purple 400
    bgGradient: 'from-purple-950/80 to-slate-900/95',
    centerCoords: { x: -9, z: 9 },
    cameraTarget: [-9, 1.2, 9],
    cameraPosition: [-16, 7.5, 16],
    interiorCameraTarget: [-9, 1.1, 9],
    interiorCameraPosition: [-11.5, 3.2, 11.5],
    operationalSector: 'Diffusion Média & Récits Dynamiques',
    activeModules: [
      'Générateur de Shorts & Synthèse Vocale',
      'Analyseur de Rétention & Hooks',
      'Mixage Sonore Spatialisé',
      'Exporteur Multi-Plateformes Instantané',
    ],
    features: [
      'Caméra cinéma 8K robotisée',
      'Panneaux softbox à température variable',
      'Cyclorama d’incrustation adaptatif',
      'Console de montage temps réel',
    ],
  },
  {
    id: 'personnel',
    name: 'Pôle Personnel — Command Center',
    codeName: 'SECTOR-04 // CENTRAL-NEXUS',
    category: 'Centre de Commandement & Stratégie',
    tagline: 'Centre névralgique de supervision, d’arbitrage et de clarté mentale',
    description:
      'Quartier général personnel de l’inventeur inspiré d’une salle d’opérations aérospatiale. Console de lancement de missions globales, moniteur d’arbitrages Human-in-the-Loop, agenda stratégique et espace de concentration.',
    accentColor: '#34d399', // Emerald 400
    bgGradient: 'from-emerald-950/80 to-slate-900/95',
    centerCoords: { x: 9, z: 9 },
    cameraTarget: [9, 1.2, 9],
    cameraPosition: [16, 7.5, 16],
    interiorCameraTarget: [9, 1.1, 9],
    interiorCameraPosition: [11.5, 3.2, 11.5],
    operationalSector: 'Supervision Globale & Dispatch Stratégique',
    activeModules: [
      'Tableau de Bord Exécutif Global',
      'Ordonnanceur de Routines Chronobiologiques',
      'Passerelle d’Approbation HITL',
      'Moniteur de Sécurité & Intégrité Système',
    ],
    features: [
      'Console centrale de lancement de missions',
      'Radar synoptique des flux d’agents',
      'Bibliothèque de modèles de pensée',
      'Station d’arbitrage prioritaire',
    ],
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-dashboard',
    name: 'Project Jarvis-Core 4.0',
    code: 'PRJ-TECH-01',
    districtId: 'tech',
    description: 'Refonte de l’architecture d’orchestration des micro-agents et tableau de bord 3D.',
    health: 'optimal',
    tasksCount: 14,
    activeAgents: ['tech-dev-ia', 'tech-veille'],
    errorCount: 0,
    commitHash: '8f3b20c',
    deliverablesCount: 8,
  },
  {
    id: 'proj-capsule',
    name: 'Atelier Capsule Printemps 2027',
    code: 'PRJ-LUXE-02',
    districtId: 'carole',
    description: 'Définition de la collection capsule haute couture, moodboards et drapés innovants.',
    health: 'optimal',
    tasksCount: 9,
    activeAgents: ['carole-styliste', 'carole-tendances'],
    errorCount: 0,
    commitHash: 'd41a99e',
    deliverablesCount: 5,
  },
  {
    id: 'proj-media',
    name: 'Omni-Channel Viral Broadcast',
    code: 'PRJ-MEDIA-03',
    districtId: 'contenu',
    description: 'Pipeline automatisé de production de formats courts verticaux pour réseaux sociaux.',
    health: 'optimal',
    tasksCount: 18,
    activeAgents: ['contenu-script', 'contenu-montage'],
    errorCount: 0,
    commitHash: '17bc42f',
    deliverablesCount: 12,
  },
  {
    id: 'proj-nexus',
    name: 'Daily Nexus Orchestrator',
    code: 'PRJ-CMD-04',
    districtId: 'personnel',
    description: 'Coordination hebdomadaire, arbitrage de calendrier et élimination des goulets d’étranglement.',
    health: 'warning',
    tasksCount: 7,
    activeAgents: ['perso-assistant', 'perso-organisateur'],
    errorCount: 1,
    commitHash: '99e28fa',
    deliverablesCount: 3,
  },
];

export const INITIAL_AGENTS: Agent[] = [
  // Pôle Tech
  {
    id: 'tech-dev-ia',
    systemId: 'AGENT-01-TECH',
    name: 'Dev IA',
    role: 'Architecte Agents & Algorithmes',
    poleId: 'tech',
    status: 'working',
    currentTask: 'Compiler les shaders WebGL et optimiser l’arbre d’interaction',
    lastActivity: 'Il y a 45s',
    progress: 74,
    hairColor: '#0f172a',
    clothesColor: '#0284c7', // Cyan
    characterPosition: [-10.2, 0.45, -9.5],
    rotationY: 0.6,
    project: 'Project Jarvis-Core 4.0',
    dependencies: ['Veille technique', 'Cluster GPU'],
    toolsUsed: ['TypeScript', 'Three.js GLSL', 'Docker', 'Vite'],
    dataSources: ['GitHub Telemetry', 'NVIDIA Container Registry'],
    logStream: [
      '[INFO] Initializing WebGL2 context with ACESFilmic tone mapping',
      '[TRACE] Compiling procedural fragment shader: dataStreamArc.frag',
      '[SUCCESS] 60 FPS verified across 8 actor groups',
      '[EVENT] Emitting telemetry packet to SECTOR-03 (Media Studio)',
    ],
    taskHistory: [
      {
        id: 't-101',
        title: 'Générer le maillage de l’île centrale',
        completedAt: 'Il y a 18 min',
        duration: '2.4s',
        status: 'success',
      },
      {
        id: 't-102',
        title: 'Tester la réactivité du raycaster Three.js',
        completedAt: 'Il y a 8 min',
        duration: '1.1s',
        status: 'success',
      },
    ],
    recentEvents: [
      {
        id: 'e-1',
        timestamp: '13:30:12',
        message: 'Optimisation de la boucle de rendu terminée',
        severity: 'success',
      },
    ],
    cpuLoad: 68,
    networkThroughput: 1420,
    isSimulated: true,
  },
  {
    id: 'tech-veille',
    systemId: 'AGENT-02-TECH',
    name: 'Veille technique',
    role: 'Analyste Modèles & Infrastructure',
    poleId: 'tech',
    status: 'thinking',
    currentTask: 'Évaluer le compromis latence/inférence des modèles multimodaux',
    lastActivity: 'Il y a 2 min',
    progress: 52,
    hairColor: '#334155',
    clothesColor: '#0ea5e9',
    characterPosition: [-7.8, 0.45, -8.2],
    rotationY: -0.8,
    project: 'Project Jarvis-Core 4.0',
    dependencies: ['Dev IA', 'Arxiv AI Feed'],
    toolsUsed: ['HuggingFace API', 'Benchmarking Suite', 'Ollama Bridge'],
    dataSources: ['HuggingFace Hub', 'Weights & Biases'],
    logStream: [
      '[FETCH] Retrieving quantization benchmarks for multimodal models',
      '[BENCH] FP16: 18.2ms per token vs INT4: 6.4ms per token',
      '[THINKING] Synthesizing memory budget for local deployment',
    ],
    taskHistory: [
      {
        id: 't-201',
        title: 'Comparatif des moteurs Vector DB',
        completedAt: 'Il y a 40 min',
        duration: '5.2s',
        status: 'success',
      },
    ],
    recentEvents: [
      {
        id: 'e-2',
        timestamp: '13:28:45',
        message: 'Synthèse des modèles multimodaux en cours',
        severity: 'info',
      },
    ],
    cpuLoad: 84,
    networkThroughput: 960,
    isSimulated: true,
  },

  // Maison Carole
  {
    id: 'carole-styliste',
    systemId: 'AGENT-03-LUXE',
    name: 'Styliste',
    role: 'Directrice Artistique & Harmonies',
    poleId: 'carole',
    status: 'review',
    currentTask: 'Valider la gamme chromatique Terre de Sienne & Nacre',
    lastActivity: 'Il y a 3 min',
    progress: 92,
    hairColor: '#78350f',
    clothesColor: '#f43f5e', // Rose
    characterPosition: [7.8, 0.45, -9.5],
    rotationY: -0.4,
    project: 'Atelier Capsule Printemps 2027',
    dependencies: ['Recherche tendances'],
    toolsUsed: ['Midjourney v6', 'Figma Token Studio', 'Pantone Digital'],
    dataSources: ['Archives Carole 2020-2026', 'Nuancier Milan Fashion Week'],
    logStream: [
      '[RENDER] 12 drape variations computed in 4K resolution',
      '[REVIEW] Human validation required for palette saturation balance',
      '[STATE] Awaiting user confirmation in Command Center',
    ],
    taskHistory: [
      {
        id: 't-301',
        title: 'Moodboard d’inspiration matières recyclées',
        completedAt: 'Il y a 32 min',
        duration: '4.8s',
        status: 'success',
      },
    ],
    recentEvents: [
      {
        id: 'e-3',
        timestamp: '13:27:10',
        message: 'Demande de validation envoyée au Command Center',
        severity: 'warn',
      },
    ],
    cpuLoad: 24,
    networkThroughput: 410,
    isSimulated: true,
  },
  {
    id: 'carole-tendances',
    systemId: 'AGENT-04-LUXE',
    name: 'Recherche tendances',
    role: 'Scout Créatif & Matériaux',
    poleId: 'carole',
    status: 'working',
    currentTask: 'Indexer 150 échantillons de lin biologique et velours côtelé',
    lastActivity: 'À l’instant',
    progress: 68,
    hairColor: '#1e293b',
    clothesColor: '#fb7185',
    characterPosition: [10.2, 0.45, -8.0],
    rotationY: 2.2,
    project: 'Atelier Capsule Printemps 2027',
    dependencies: ['Styliste'],
    toolsUsed: ['Pinterest API', 'Textile Database', 'Vogue Archive OCR'],
    dataSources: ['Première Vision Paris', 'WGSN Trend Reports'],
    logStream: [
      '[INDEX] Extracting material specifications: Organic Linen 320g/m2',
      '[STREAM] Syncing material tokens with Styliste workstation',
      '[STATUS] 68% of texture profiles verified',
    ],
    taskHistory: [
      {
        id: 't-401',
        title: 'Rapport des tendances éco-responsables',
        completedAt: 'Il y a 1h',
        duration: '7.1s',
        status: 'success',
      },
    ],
    recentEvents: [
      {
        id: 'e-4',
        timestamp: '13:31:00',
        message: 'Transfert de données vers Styliste en cours',
        severity: 'info',
      },
    ],
    cpuLoad: 45,
    networkThroughput: 1840,
    isSimulated: true,
  },

  // Pôle Contenu
  {
    id: 'contenu-script',
    systemId: 'AGENT-05-MEDIA',
    name: 'Script vidéo',
    role: 'Concepteur & Storyteller Média',
    poleId: 'contenu',
    status: 'done',
    currentTask: 'Script finalisé : « L’univers des agents IA en 45 secondes »',
    lastActivity: 'Il y a 12 min',
    progress: 100,
    hairColor: '#090d16',
    clothesColor: '#8b5cf6', // Violet
    characterPosition: [-10.2, 0.45, 8.5],
    rotationY: 0.8,
    project: 'Omni-Channel Viral Broadcast',
    dependencies: ['Dev IA', 'Montage short'],
    toolsUsed: ['Claude 3.5 Sonnet', 'Notion Script Template', 'ElevenLabs TTS'],
    dataSources: ['Trend TikTok Analytics', 'Hook Library v3'],
    logStream: [
      '[SCRIPT] Hook retention score estimated at 88.4%',
      '[VOICE] Speech generation duration: 44.8s (target 45s)',
      '[HANDOFF] Script transmitted to Montage Short station',
    ],
    taskHistory: [
      {
        id: 't-501',
        title: '3 déclinaisons d’accroches virales',
        completedAt: 'Il y a 24 min',
        duration: '1.9s',
        status: 'success',
      },
    ],
    recentEvents: [
      {
        id: 'e-5',
        timestamp: '13:18:22',
        message: 'Livraison du script validée avec succès',
        severity: 'success',
      },
    ],
    cpuLoad: 12,
    networkThroughput: 180,
    isSimulated: true,
  },
  {
    id: 'contenu-montage',
    systemId: 'AGENT-06-MEDIA',
    name: 'Montage short',
    role: 'Monteur Dynamique & Motion Designer',
    poleId: 'contenu',
    status: 'working',
    currentTask: 'Calcul du rendu avec sous-titres cinétiques et transitions audio',
    lastActivity: 'Il y a 30s',
    progress: 81,
    hairColor: '#ca8a04',
    clothesColor: '#a855f7',
    characterPosition: [-7.8, 0.45, 9.8],
    rotationY: -1.2,
    project: 'Omni-Channel Viral Broadcast',
    dependencies: ['Script vidéo', 'Dev IA'],
    toolsUsed: ['Remotion', 'FFmpeg WebAssembly', 'AfterEffects Bridge'],
    dataSources: ['Asset Bank Media', 'Soundly SFX Library'],
    logStream: [
      '[RENDER] Frame 840/1080 rendered @ 60 FPS',
      '[AUDIO] Audio waveform normalisation: -14 LUFS integrated',
      '[NETWORK] Receiving real-time shader feedback from Pôle Tech',
    ],
    taskHistory: [
      {
        id: 't-601',
        title: 'Dérushage automatique des captures 3D',
        completedAt: 'Il y a 15 min',
        duration: '6.4s',
        status: 'success',
      },
    ],
    recentEvents: [
      {
        id: 'e-6',
        timestamp: '13:30:50',
        message: 'Rendu vidéo à 81% - Export sous 20s',
        severity: 'info',
      },
    ],
    cpuLoad: 92,
    networkThroughput: 3120,
    isSimulated: true,
  },

  // Pôle Personnel
  {
    id: 'perso-assistant',
    systemId: 'AGENT-07-CMD',
    name: 'Assistant quotidien',
    role: 'Coordinateur Planning & Routines',
    poleId: 'personnel',
    status: 'working',
    currentTask: 'Synchroniser les priorités des 4 pôles pour l’arbitrage du soir',
    lastActivity: 'Il y a 1 min',
    progress: 88,
    hairColor: '#1e293b',
    clothesColor: '#10b981', // Émeraude
    characterPosition: [8.0, 0.45, 8.2],
    rotationY: 0.3,
    project: 'Daily Nexus Orchestrator',
    dependencies: ['Organisateur', 'Dev IA', 'Styliste'],
    toolsUsed: ['Google Calendar API', 'Linear Sync', 'Cron Engine'],
    dataSources: ['Agenda Personnel', 'Télémétrie Campus'],
    logStream: [
      '[POLL] Aggregating status from 4 operational sectors',
      '[SCHEDULE] 3 Deep Work blocks preserved for tomorrow',
      '[ALERT] Detected conflict in Organisateur queue',
    ],
    taskHistory: [
      {
        id: 't-701',
        title: 'Revue matinale des priorités',
        completedAt: 'Il y a 4h',
        duration: '0.8s',
        status: 'success',
      },
    ],
    recentEvents: [
      {
        id: 'e-7',
        timestamp: '13:29:40',
        message: 'Priorités hebdomadaires compilées',
        severity: 'info',
      },
    ],
    cpuLoad: 35,
    networkThroughput: 620,
    isSimulated: true,
  },
  {
    id: 'perso-organisateur',
    systemId: 'AGENT-08-CMD',
    name: 'Organisateur',
    role: 'Gestionnaire Logistique & Rappels',
    poleId: 'personnel',
    status: 'error',
    currentTask: 'Chevauchement détecté sur la réservation du cluster GPU',
    lastActivity: 'Il y a 5 min',
    progress: 18,
    hairColor: '#78350f',
    clothesColor: '#059669',
    characterPosition: [10.3, 0.45, 9.6],
    rotationY: -2.3,
    project: 'Daily Nexus Orchestrator',
    dependencies: ['Assistant quotidien', 'Dev IA'],
    toolsUsed: ['Resource Allocator', 'Stripe Billing Webhook', 'Slack Dispatch'],
    dataSources: ['GCP Quotas', 'Cloud Run Reservation Log'],
    logStream: [
      '[ERROR] GPU cluster allocation collision: Tech Lab vs Media Render',
      '[FATAL] Concurrency conflict on Node-3 resource lock',
      '[ACTION REQUIRED] Arbitrage humain requis dans le Command Center',
    ],
    taskHistory: [
      {
        id: 't-801',
        title: 'Planifier les sauvegardes automatiques',
        completedAt: 'Il y a 2h',
        duration: '1.2s',
        status: 'success',
      },
      {
        id: 't-802',
        title: 'Réservation de créneau de calcul',
        completedAt: 'Il y a 10 min',
        duration: '3.1s',
        status: 'failed',
      },
    ],
    recentEvents: [
      {
        id: 'e-8',
        timestamp: '13:26:15',
        message: 'Conflit de ressource GPU détecté',
        severity: 'error',
      },
    ],
    cpuLoad: 15,
    networkThroughput: 40,
    isSimulated: true,
  },

  // Chief Executive Officer / Strategic Orchestrator
  {
    id: 'ceo-orchestrator',
    systemId: 'AGENT-00-CEO',
    name: 'Aura (CEO)',
    role: 'Chief Executive Orchestrator & Dispatcher',
    poleId: 'personnel',
    status: 'working',
    currentTask: 'Orchestration stratégique & Dispatch multi-pôles en cours',
    lastActivity: 'À l’instant',
    progress: 92,
    hairColor: '#f8fafc',
    clothesColor: '#f59e0b', // Luxury Golden Amber
    characterPosition: [13.5, 0.45, 13.8],
    rotationY: 3.14,
    project: 'Daily Nexus Orchestrator',
    dependencies: ['Tous les Pôles (Tech, Carole, Contenu, Nexus)'],
    toolsUsed: ['Strategic Dispatcher', 'DAG Orchestrator', 'Cross-Pole Arbiter', 'LLM Planner'],
    dataSources: ['KPIs Campus Globaux', 'Objectifs Stratégiques Q2', 'Capacité Réseau & GPU'],
    logStream: [
      '[CEO ORCHESTRATOR] Campus heartbeat nominal - 8 agents sous supervision',
      '[STRATEGY] Analyse globale des goulets d’étranglement et dépendances',
      '[DISPATCH ENGINE] Passerelle de routage active vers Tech, Carole, Contenu & Nexus',
      '[HITL] Prêt pour injection et décomposition de directives exécutives',
    ],
    taskHistory: [
      {
        id: 't-ceo-01',
        title: 'Décomposition stratégique Roadmap Q2',
        completedAt: 'Il y a 25 min',
        duration: '1.2s',
        status: 'success',
      },
      {
        id: 't-ceo-02',
        title: 'Arbitrage priorités GPU Tech vs Media',
        completedAt: 'Il y a 1h',
        duration: '0.8s',
        status: 'success',
      },
    ],
    recentEvents: [
      {
        id: 'e-ceo-1',
        timestamp: '13:35:00',
        message: 'Orchestrateur CEO en écoute active des directives',
        severity: 'success',
      },
    ],
    cpuLoad: 48,
    networkThroughput: 4800,
    isSimulated: true,
  },
];

export const INITIAL_DATA_FLOWS: DataFlowConnection[] = [
  {
    id: 'flow-tech-to-media',
    fromAgentId: 'tech-dev-ia',
    toAgentId: 'contenu-montage',
    fromDistrictId: 'tech',
    toDistrictId: 'contenu',
    payloadType: 'Shader GLSL & Télémétrie 3D',
    missionId: 'm-tech-media-01',
    timestamp: '13:30:15',
    status: 'active',
    latencyMs: 14,
    curvePoints: [
      [-10.2, 0.6, -9.5],
      [-9.0, 4.5, 0],
      [-7.8, 0.6, 9.8],
    ],
  },
  {
    id: 'flow-carole-sync',
    fromAgentId: 'carole-tendances',
    toAgentId: 'carole-styliste',
    fromDistrictId: 'carole',
    toDistrictId: 'carole',
    payloadType: 'Nuancier PBR & Textures Lin',
    missionId: 'm-carole-02',
    timestamp: '13:31:00',
    status: 'active',
    latencyMs: 6,
    curvePoints: [
      [10.2, 0.6, -8.0],
      [9.0, 2.8, -8.8],
      [7.8, 0.6, -9.5],
    ],
  },
  {
    id: 'flow-script-to-montage',
    fromAgentId: 'contenu-script',
    toAgentId: 'contenu-montage',
    fromDistrictId: 'contenu',
    toDistrictId: 'contenu',
    payloadType: 'Timeline Audio & Voice Track',
    missionId: 'm-media-03',
    timestamp: '13:25:30',
    status: 'completed',
    latencyMs: 8,
    curvePoints: [
      [-10.2, 0.6, 8.5],
      [-9.0, 2.5, 9.1],
      [-7.8, 0.6, 9.8],
    ],
  },
  {
    id: 'flow-tech-veille-dev',
    fromAgentId: 'tech-veille',
    toAgentId: 'tech-dev-ia',
    fromDistrictId: 'tech',
    toDistrictId: 'tech',
    payloadType: 'Benchmark Matrice d’Inférence',
    missionId: 'm-tech-04',
    timestamp: '13:28:10',
    status: 'queued',
    latencyMs: 22,
    curvePoints: [
      [-7.8, 0.6, -8.2],
      [-9.0, 2.6, -8.8],
      [-10.2, 0.6, -9.5],
    ],
  },
  {
    id: 'flow-cmd-collision',
    fromAgentId: 'perso-organisateur',
    toAgentId: 'perso-assistant',
    fromDistrictId: 'personnel',
    toDistrictId: 'personnel',
    payloadType: 'Alerte Collision Cluster GPU',
    missionId: 'm-cmd-05',
    timestamp: '13:26:15',
    status: 'blocked',
    latencyMs: 120,
    curvePoints: [
      [10.3, 0.6, 9.6],
      [9.2, 2.8, 8.9],
      [8.0, 0.6, 8.2],
    ],
  },
];

export const INITIAL_SYSTEM_EVENTS: SystemEvent[] = [
  {
    id: 'evt-1',
    timestamp: '13:31:00',
    type: 'data_transfer',
    agentId: 'carole-tendances',
    districtId: 'carole',
    description: 'Flux actif : 150 profils textiles transférés vers Styliste',
    severity: 'info',
  },
  {
    id: 'evt-2',
    timestamp: '13:30:15',
    type: 'data_transfer',
    agentId: 'tech-dev-ia',
    districtId: 'tech',
    description: 'Pipeline inter-pôles : Shaders 3D transmis au Pôle Contenu',
    severity: 'info',
  },
  {
    id: 'evt-3',
    timestamp: '13:27:10',
    type: 'review_needed',
    agentId: 'carole-styliste',
    districtId: 'carole',
    description: 'Validation humaine en attente pour la gamme chromatique 2027',
    severity: 'warning',
  },
  {
    id: 'evt-4',
    timestamp: '13:26:15',
    type: 'error_detected',
    agentId: 'perso-organisateur',
    districtId: 'personnel',
    description: 'Incident détecté : collision d’allocation sur le cluster GPU',
    severity: 'error',
  },
  {
    id: 'evt-5',
    timestamp: '13:18:22',
    type: 'deploy_completed',
    agentId: 'contenu-script',
    districtId: 'contenu',
    description: 'Mission terminée : script court vidéo livré et archivé',
    severity: 'success',
  },
];

export function getInitialAgents(): Agent[] {
  return JSON.parse(JSON.stringify(INITIAL_AGENTS));
}

export function getInitialProjects(): Project[] {
  return JSON.parse(JSON.stringify(INITIAL_PROJECTS));
}

export function getInitialDataFlows(): DataFlowConnection[] {
  return JSON.parse(JSON.stringify(INITIAL_DATA_FLOWS));
}

export function getInitialSystemEvents(): SystemEvent[] {
  return JSON.parse(JSON.stringify(INITIAL_SYSTEM_EVENTS));
}

export function computeSystemTelemetry(agents: Agent[]): SystemTelemetry {
  const activeCount = agents.filter(
    (a) => a.status === 'working' || a.status === 'thinking'
  ).length;
  const errorCount = agents.filter((a) => a.status === 'error').length;
  const reviewCount = agents.filter((a) => a.status === 'review').length;

  return {
    status: errorCount > 0 ? 'DEGRADED' : activeCount > 0 ? 'OPTIMAL' : 'ONLINE',
    activeAgents: activeCount,
    totalAgents: agents.length,
    activeMissions: activeCount + reviewCount,
    systemAlerts: errorCount,
    neuralLatencyMs: 14.8 + Math.sin(Date.now() * 0.001) * 3,
    simulatedMode: true,
  };
}

export function updateAgentState(
  agents: Agent[],
  agentId: string,
  newStatus: AgentState,
  newTask?: string,
  progress?: number
): Agent[] {
  return agents.map((agent) => {
    if (agent.id !== agentId) return agent;
    const updatedProgress =
      progress !== undefined
        ? progress
        : newStatus === 'done'
        ? 100
        : newStatus === 'error'
        ? Math.max(15, agent.progress)
        : agent.progress;

    return {
      ...agent,
      status: newStatus,
      currentTask: newTask ?? agent.currentTask,
      lastActivity: 'À l’instant',
      progress: updatedProgress,
      cpuLoad:
        newStatus === 'working'
          ? Math.floor(65 + Math.random() * 25)
          : newStatus === 'thinking'
          ? Math.floor(80 + Math.random() * 15)
          : newStatus === 'offline'
          ? 0
          : Math.floor(10 + Math.random() * 20),
    };
  });
}

export function assignNewMission(
  agents: Agent[],
  agentId: string,
  missionTitle: string,
  project?: string,
  initialState: AgentState = 'working'
): Agent[] {
  return agents.map((agent) => {
    if (agent.id !== agentId) return agent;
    return {
      ...agent,
      currentTask: missionTitle.trim() || agent.currentTask,
      status: initialState,
      project: project || agent.project,
      lastActivity: 'À l’instant',
      progress: initialState === 'done' ? 100 : 10,
      cpuLoad: 75,
      taskHistory: [
        {
          id: `t-${Date.now()}`,
          title: missionTitle,
          completedAt: 'En cours',
          duration: 'En cours',
          status: 'success',
        },
        ...agent.taskHistory,
      ],
    };
  });
}

/**
 * Tactical Copilot Command Resolver (Deterministic NLP Parser)
 */
export interface CopilotResolution {
  reply: string;
  action?: {
    type: 'SELECT_AGENT' | 'FOCUS_DISTRICT' | 'SET_VIEW_MODE' | 'FILTER_STATUS' | 'RESET_VIEW';
    targetId?: string;
    viewMode?: 'spatial' | 'flightradar' | 'github_city';
    filterStatus?: AgentState;
  };
}

export function processCopilotQuery(
  rawQuery: string,
  agents: Agent[],
  projects: Project[]
): CopilotResolution {
  const query = rawQuery.toLowerCase().trim();

  // 1. Agents bloqués ou en erreur
  if (
    query.includes('bloqué') ||
    query.includes('erreur') ||
    query.includes('incident') ||
    query.includes('problème')
  ) {
    const errorAgents = agents.filter((a) => a.status === 'error');
    const waitingAgents = agents.filter((a) => a.status === 'waiting');

    if (errorAgents.length === 0 && waitingAgents.length === 0) {
      return {
        reply: 'Tous les sous-systèmes fonctionnent sans blocage. Aucune anomalie détectée.',
      };
    }

    const names = [
      ...errorAgents.map((a) => `${a.name} (Erreur : ${a.currentTask})`),
      ...waitingAgents.map((a) => `${a.name} (En attente de ressource)`),
    ].join(', ');

    const firstError = errorAgents[0] || waitingAgents[0];

    return {
      reply: `Point d'attention critique : ${names}. Caméra verrouillée sur ${firstError.name}.`,
      action: {
        type: 'SELECT_AGENT',
        targetId: firstError.id,
      },
    };
  }

  // 2. Tâches en attente de validation
  if (
    query.includes('validation') ||
    query.includes('attente') ||
    query.includes('review') ||
    query.includes('valider')
  ) {
    const reviewAgents = agents.filter((a) => a.status === 'review');
    if (reviewAgents.length === 0) {
      return {
        reply: "Aucun livrable n'est actuellement en attente d'approbation humaine.",
      };
    }
    const target = reviewAgents[0];
    return {
      reply: `${reviewAgents.length} tâche(s) requiert votre validation. Notamment : ${target.name} sur "${target.currentTask}".`,
      action: {
        type: 'SELECT_AGENT',
        targetId: target.id,
      },
    };
  }

  // 3. Projet avec le plus de tâches
  if (
    query.includes('projet') &&
    (query.includes('plus') || query.includes('tâche') || query.includes('activité'))
  ) {
    const topProject = [...projects].sort((a, b) => b.tasksCount - a.tasksCount)[0];
    return {
      reply: `Le projet avec la plus forte charge est "${topProject.name}" (${topProject.tasksCount} tâches, district ${topProject.districtId.toUpperCase()}).`,
      action: {
        type: 'FOCUS_DISTRICT',
        targetId: topProject.districtId,
      },
    };
  }

  // Visual modes check first to avoid collision with 'mode' (fashion)
  if (query.includes('flightradar') || query.includes('flux') || query.includes('réseau') || query.includes('radar')) {
    return {
      reply: 'Activation du mode FlightRadar : visualisation des flux inter-agents en temps réel.',
      action: { type: 'SET_VIEW_MODE', viewMode: 'flightradar' },
    };
  }
  if (query.includes('github') || query.includes('city') || query.includes('twin') || query.includes('jumeau')) {
    return {
      reply: 'Activation du mode GitHub City : projection géométrique des modules et dépôts.',
      action: { type: 'SET_VIEW_MODE', viewMode: 'github_city' },
    };
  }
  if (query.includes('vue globale') || query.includes('monde') || query.includes('reset') || query.includes('overworld')) {
    return {
      reply: 'Recentrage de la matrice spatiale sur la vue Overworld.',
      action: { type: 'RESET_VIEW' },
    };
  }

  // Navigation vers districts
  if (query.includes('tech') || query.includes('développement') || query.includes('code') || query.includes('quantum')) {
    return {
      reply: 'Transition vers le Pôle Tech (Engineering Lab & Neural Cluster).',
      action: { type: 'FOCUS_DISTRICT', targetId: 'tech' },
    };
  }
  if (query.includes('carole') || query.includes('stylisme') || query.includes('textile') || query.includes('haute couture')) {
    return {
      reply: 'Transition vers Maison Carole (Creative House & Haute Création).',
      action: { type: 'FOCUS_DISTRICT', targetId: 'carole' },
    };
  }
  if (query.includes('contenu') || query.includes('vidéo') || query.includes('média') || query.includes('studio') || query.includes('short')) {
    return {
      reply: 'Transition vers le Pôle Contenu (Cyber-Broadcast & Media Studio).',
      action: { type: 'FOCUS_DISTRICT', targetId: 'contenu' },
    };
  }
  if (query.includes('personnel') || query.includes('command center') || query.includes('nexus') || query.includes('arbitrage')) {
    return {
      reply: 'Transition vers le Pôle Personnel (Command Center & Central Nexus).',
      action: { type: 'FOCUS_DISTRICT', targetId: 'personnel' },
    };
  }

  // 6. Recherche d'agent par nom
  for (const ag of agents) {
    if (query.includes(ag.name.toLowerCase())) {
      return {
        reply: `Localisation de l'agent ${ag.name} (${ag.role}) — État : ${ag.status.toUpperCase()}.`,
        action: { type: 'SELECT_AGENT', targetId: ag.id },
      };
    }
  }

  // Fallback
  return {
    reply: `Instruction reçue. Télémesure active. Vous pouvez demander : "Quels agents sont bloqués ?", "Active le mode FlightRadar", ou "Ouvre le Pôle Tech".`,
  };
}
