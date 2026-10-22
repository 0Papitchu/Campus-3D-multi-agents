# Écosystème & Gouvernance Multi-Agents — Work Sims 3D

Mise en place d'une infrastructure fonctionnelle complète pour l'écosystème d'agents : orchestration de pipelines de travail multi-agents en cascade, panneau de gouvernance & configuration globale, et observabilité AgentOps avancée.

---

## Décisions Validées & Périmètre

> [!IMPORTANT]
> Les 3 axes fonctionnels confirmés par l'utilisateur sont :
> 1. **Pipelines multi-agents en cascade & DAG de données** : Enchaînement de tâches séquentielles et parallèles d'un agent à l'autre avec passage de livrables.
> 2. **Panneau de Settings global & Gouvernance** : Modes d'autonomie (Human-in-the-loop vs plein autonome), connecteurs d'écosystème et plafonds de quotas.
> 3. **Observabilité AgentOps & Traces de raisonnement** : Métriques de performance, consommation de tokens, matrice de collaboration inter-pôles et logs d'exécution structurés.

---

## 1. Vue d'ensemble & Concept Central

L'application passe d'une simulation d'agents isolés à une plateforme d'orchestration multi-agents collaborative :
- **Orchestrateur de Pipelines (Workflows DAG)** : Les projets complexes ne sont plus exécutés par un seul agent, mais découpés en étapes interconnectées. Dès qu'un agent termine son étape (ex: benchmark veille), son livrable est transmis automatiquement au poste de travail de l'agent suivant (ex: dev frontend) avec animation des flux 3D.
- **Hub de Gouvernance & Paramètres Globaux** : Un panneau de configuration centralisé permettant au responsable de régler la politique d'autonomie de l'entreprise, les connecteurs et les seuils d'intervention humaine.
- **Observabilité AgentOps** : Une console d'analyse pour auditer la consommation de ressources, mesurer l'efficacité de chaque agent et inspecter le fil de raisonnement (*Thought ➔ Action ➔ Output*).

---

## 2. Expérience Utilisateur & Design d'Interface

### A. Studio d'Orchestration de Pipelines (`PipelineManagerModal.tsx`)
- **Bibliothèque de Pipelines prédéfinis** :
  - *Sprint Feature IA* : Veille Tech ➔ Dev IA ➔ Styliste Carole ➔ Script Contenu ➔ Déploiement Nexus.
  - *Campagne Média & Moodboard* : Tendances ➔ Stylisme ➔ Script ➔ Montage.
  - *Audit Infrastructure & Sécurité* : Audit Serveurs ➔ Optimisation IA ➔ Coordination.
- **Visualisation interactive du flux (DAG)** :
  - Carte des étapes avec statut en direct (`En attente`, `En cours`, `Terminé`, `Revue requise`).
  - Affichage de l'artefact produit à chaque étape (JSON, extrait de code, spécification de design, script).
  - Contrôles d'exécution : *Lancer le pipeline*, *Exécution pas-à-pas*, *Pause*, *Relancer*.
- **Synchronisation 3D** : Lorsqu'un livrable passe d'un agent à un autre, la caméra 3D met en valeur le conduit lumineux entre leurs postes et l'agent destinataire commence son animation de travail.

### B. Panneau de Paramètres Globaux & Gouvernance (`EcosystemSettingsModal.tsx`)
- **Onglet 1 : Gouvernance & Autonomie** :
  - Sélecteur de mode global : *Autonomie Complète* vs *Human-in-the-Loop (Validation requise)*.
  - Règles d'approbation sur les livrables critiques (ex: validation obligatoire avant livraison en production).
  - Seuil d'alerte de charge CPU (ex: 85%) et temps de repos imposé.
- **Onglet 2 : Connecteurs & Sources de données** :
  - Configuration des intégrations d'entreprise : Dépôt GitHub cible, Webhook Slack/Discord de notification, flux RSS de veille, bibliothèque Figma.
  - Statut des connecteurs (Actif / En pause / Synchronisé).
- **Onglet 3 : Quotas & Politiques de Retry** :
  - Plafond de tokens journaliers par pôle.
  - Stratégie d'erreur : Relance automatique avec modèle supérieur ou réassignation à un collègue.

### C. Console d'Observabilité AgentOps (`AgentOpsConsoleModal.tsx`)
- **Métriques Clés (KPI Cards)** :
  - Tokens totaux consommés & Coût estimé.
  - Taux de complétion des pipelines et temps moyen de traitement.
  - Ratio de collaboration inter-pôles.
- **Matrice de Collaboration Pôle-à-Pôle** :
  - Tableau croisé des flux montrant qui alimente qui (ex: Tech vers Contenu, Carole vers Tech).
- **Inspecteur de Traces d'Exécution (Execution Trace Viewer)** :
  - Déroulé chronologique de chaque décision d'agent :
    `[Pensée]` Analyser la spécification ➔ `[Outil]` WebGL Shader Compiler ➔ `[Observation]` 0 erreur, 60 FPS ➔ `[Livrable]` Patch appliqué.

---

## 3. Décisions Produit & Architecture Technique

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ECOSYSTEM STATE STORE (React / App)                   │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────┐ │
│  │   Pipeline Engine    │  │  Ecosystem Settings  │  │   AgentOps Store   │ │
│  │  • Active Workflows  │  │  • Autonomy Level    │  │  • Token Metrics   │ │
│  │  • Step Progress     │  │  • Connectors Config │  │  • Execution Traces│ │
│  │  • Artifact Payloads │  │  • Retry Policies    │  │  • Audit Logs      │ │
│  └──────────┬───────────┘  └──────────┬───────────┘  └─────────┬──────────┘ │
└─────────────┼─────────────────────────┼────────────────────────┼────────────┘
              │                         │                        │
              ▼                         ▼                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MODALS & DRAWERS                               │
│                                                                             │
│  ┌─────────────────────────┐ ┌──────────────────────┐ ┌───────────────────┐ │
│  │ PipelineManagerModal    │ │ EcosystemSettings    │ │ AgentOpsConsole   │ │
│  │ • DAG Graph View        │ │ • Autonomy & Quotas  │ │ • KPIs & Charts   │ │
│  │ • Step-by-Step Exec     │ │ • Webhooks & Connect │ │ • Reasoning Traces│ │
│  └─────────────────────────┘ └──────────────────────┘ └───────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼ 3D Visual Feedback
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WORLD SCENE 3D ENGINE                             │
│  • Conduits lumineux activés lors du passage d'étape pipeline               │
│  • Agents assignés se lèvent ou retournent au bureau selon l'étape          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Modules créés & adaptés :
1. `src/types/pipeline.ts` : Modèle de données pour les pipelines DAG, étapes, connecteurs, métriques de tokens et traces de raisonnement.
2. `src/simulation/pipelineEngine.ts` : Moteur de simulation d'exécution de pipelines avec transmission de livrables et génération de traces AgentOps.
3. `src/components/PipelineManagerModal.tsx` : Interface d'orchestration visuelle des pipelines avec graphe des étapes et suivi en direct.
4. `src/components/EcosystemSettingsModal.tsx` : Hub de paramétrage de l'autonomie, des quotas, des connecteurs et des politiques de retry.
5. `src/components/AgentOpsConsoleModal.tsx` : Tableau de bord d'observabilité avec KPI de tokens, matrice de collaboration et visualiseur de traces.
6. `src/types/dispatch.ts` & `src/simulation/ceoPresets.ts` : Types et bibliothèque de décomposition stratégique pour le CEO.
7. `src/components/CEODispatchModal.tsx` : Console exécutive de dispatching du CEO vers les 4 pôles.
8. `src/components/TopCommandBar.tsx` & `src/components/SimsBottomBar.tsx` : Déclencheurs `👑 Dispatch CEO` et fiches de compétences avec badge royal.
9. `src/App.tsx` : Intégration globale de l'état des pipelines, exécution du dispatching CEO, et mise à jour des flux 3D.

---

## 4. Agent Orchestrateur CEO (Aura) — Fonctionnalités Implémentées

- **Identité & Modèle 3D de l'Agent** :
  - ID : `ceo-orchestrator`, Nom : `Aura (CEO)`.
  - Rôle : `Chief Executive Orchestrator & Dispatcher`.
  - Position 3D : Bureau d'angle exécutif en verre dans le Command Center (Secteur 4, `[13.5, 0.45, 13.8]`).
  - Caractéristiques visuelles 3D : Tenue ambre/or luxueuse (`#f59e0b`), couronne 3D dorée à 6 pointes sur la tête, Plumbob Sims royal doré en rotation continue au-dessus d'elle.
- **Console Exécutive de Dispatching (`CEODispatchModal.tsx`)** :
  - **Directives stratégiques en 1 clic** :
    - *Lancement Produit V2 (Web3D & Expérience Visuelle)*
    - *Campagne Virale Mode Digitale (TikTok & Reels)*
    - *Optimisation Coûts & Audit Performance Campus*
    - *Démo Stratégique & Présentation Grand Compte (VIP)*
  - **Prompt Libre & Décomposition IA** : Champ de directive libre décomposé automatiquement en 4 sous-tâches concrètes adaptées aux compétences de chaque pôle.
  - **Matrice de Dispatching Multi-Pôles** : Prévisualisation des tâches, livrables attendus, priorités (urgente, haute, normale), avec possibilité de modifier les textes ou d'activer/désactiver des pôles cibles.
  - **Action de Dispatching en direct** : Mise à jour instantanée du travail des agents dans le campus, bulles de pensée `👑`/`⚡` en 3D, journal d'activité système et traces d'observabilité AgentOps.
- **Intégrations IHM** :
  - Bouton `👑 Dispatch CEO` dans la barre supérieure `TopCommandBar`.
  - Badge royal et bouton `👑 Dispatcher` dans la barre inférieure `SimsBottomBar`.
  - Zoom caméra direct sur le bureau d'Aura.

---

## 5. Statut de Vérification
- `npm run lint` (`tsc --noEmit`) : **0 erreur** (Codebase 100% typée et valide).
- `compile_applet` (`npm run build`) : **Succès de compilation**.
- Rendu 3D Three.js : Présence visible de l'agent CEO avec couronne dorée et animation à 60 FPS.
