import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  buildAgentCharacter,
  buildDataFlowCurves,
  buildGitHubCityTowers,
} from './propsBuilder.ts';
import { buildModernOfficeFloor, type OfficeBuildingComponents } from './officeBuilding.ts';
import { POLES } from '../simulation/dataEngine.ts';
import type {
  Agent,
  PoleId,
  ViewMode,
  ZoomLevel,
  DataFlowConnection,
  Project,
} from '../types/world.ts';

export interface WorldSceneCallbacks {
  onSelectAgent: (agentId: string) => void;
  onSelectPole: (poleId: PoleId) => void;
  onSelectDataFlow?: (flowId: string) => void;
  onSelectProject?: (projectId: string) => void;
  onCanvasClickEmpty: () => void;
  onCameraLevelChange?: (level: ZoomLevel) => void;
  onFPSModeChange?: (isActive: boolean, agentName: string, locationName: string) => void;
  onFPSLocationChange?: (locationName: string) => void;
  onFollowAgentChange?: (agentId: string | null) => void;
}

export interface AgentSimRecord {
  group: THREE.Group;
  character: ReturnType<typeof buildAgentCharacter>;
  agent: Agent;
  deskPos: THREE.Vector3;
  deskRotY: number;
  currentPos: THREE.Vector3;
  targetPos: THREE.Vector3 | null;
  activity: 'desk_working' | 'coffee_break' | 'in_meeting' | 'socializing' | 'walking';
  walkCycle: number;
  idleTimer: number;
  nextDecisionTime: number;
  currentThought: { emoji: string; text: string };
}

export class WorldScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private lastRenderTime: number = 0;

  // Camera targets for smooth transitions (Orbit Mode)
  private isTransitioning: boolean = false;
  private cameraTargetLookAt: THREE.Vector3 = new THREE.Vector3(0, 1.2, 0);
  private cameraTargetPosition: THREE.Vector3 = new THREE.Vector3(26, 24, 26);
  private trackingAgentId: string | null = null;
  private followAgentId: string | null = null;
  private currentZoomLevel: ZoomLevel = 'overworld';

  // Current View Mode
  private viewMode: ViewMode = 'spatial';

  // Interaction
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointer: THREE.Vector2 = new THREE.Vector2();
  private callbacks: WorldSceneCallbacks;

  // Interactive targets
  private agentMeshes: Map<string, AgentSimRecord> = new Map();
  private selectedAgentId: string | null = null;
  private simSpeed: number = 1; // 0 = pause, 1 = normal, 2 = fast, 4 = turbo

  // Sims Floor Click Marker
  private clickMarker: THREE.Mesh | null = null;
  private clickMarkerTimer: number = 0;

  private poleHitboxes: Map<PoleId, THREE.Mesh> = new Map();
  private poleLabelSprites: Map<PoleId, THREE.Sprite> = new Map();
  private showLabels: boolean = true;

  // Modern Office Floor Components
  private officeComponents: OfficeBuildingComponents | null = null;

  // FlightRadar & GitHub City Layers
  private flightRadarGroup: THREE.Group | null = null;
  private flightPackets: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; speed: number; progress: number }[] = [];
  private githubCityGroup: THREE.Group | null = null;

  // FPS (First-Person Exploration) Controller State
  private isFPSMode: boolean = false;
  private fpsAgentId: string | null = null;
  private fpsPlayerPos: THREE.Vector3 = new THREE.Vector3(0, 1.65, 0);
  private fpsYaw: number = 0;
  private fpsPitch: number = 0;
  private stepTimer: number = 0;
  private keysPressed: Record<string, boolean> = {};
  private lastReportedSector: string = '';
  private isPointerDown: boolean = false;
  private lastPointerPos: { x: number; y: number } = { x: 0, y: 0 };

  // Headless mode
  private isHeadless: boolean = false;

  constructor(
    container: HTMLElement,
    agents: Agent[],
    dataFlows: DataFlowConnection[],
    projects: Project[],
    callbacks: WorldSceneCallbacks
  ) {
    this.container = container;
    this.callbacks = callbacks;

    this.isHeadless =
      typeof navigator !== 'undefined' &&
      (Boolean(navigator.webdriver) ||
        /HeadlessChrome/i.test(navigator.userAgent));

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Deep Atmosphere
    this.scene = new THREE.Scene();
    const skyColor = new THREE.Color(0x050811);
    this.scene.background = skyColor;
    this.scene.fog = new THREE.Fog(skyColor, 45, 120);

    // 2. Camera (Full 360° Perspective)
    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.5, 250);
    const initialPos = this.getOverworldCameraPos();
    this.camera.position.copy(initialPos);
    this.cameraTargetPosition.copy(initialPos);
    this.camera.lookAt(0, 1.2, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isHeadless,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(
      this.isHeadless ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = !this.isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 4. Controls (Smooth 360° rotation)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2.05; // Prevent ground clip
    this.controls.minDistance = 4;
    this.controls.maxDistance = 85;
    this.controls.target.set(0, 1.2, 0);

    // 5. Studio Environment Map (PMREMGenerator)
    if (!this.isHeadless) {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture;
      pmremGenerator.dispose();
    }

    // 6. Lighting Setup
    this.setupLighting();

    // 7. Build Modern Glass Office Floor Building
    this.buildOfficeWorld();
    this.spawnAgents(agents);
    this.createPoleLabels();

    // 8. Build FlightRadar & GitHub City Layers
    this.buildLayers(dataFlows, projects);

    // 9. Event Listeners
    this.setupEvents();

    // 10. Start Render Loop
    this.lastTime = performance.now();
    this.tick = this.tick.bind(this);
    this.animFrameId = requestAnimationFrame(this.tick);
  }

  private setupLighting() {
    // Cool cyan/slate ambient fill
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x050811, 0.7);
    this.scene.add(hemiLight);

    // Warm Sun Directional Light
    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.5);
    sunLight.position.set(24, 38, 20);
    if (!this.isHeadless) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 90;
      const d = 26;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    this.scene.add(sunLight);

    // Subtle blue rim light
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.6);
    rimLight.position.set(-24, 18, -24);
    this.scene.add(rimLight);
  }

  private buildOfficeWorld() {
    // Build the high-end modern glass office building structure
    this.officeComponents = buildModernOfficeFloor();
    this.scene.add(this.officeComponents.group);

    // Register hitboxes
    this.officeComponents.poleHitboxes.forEach((box, id) => {
      this.poleHitboxes.set(id, box);
    });
  }

  private spawnAgents(agents: Agent[]) {
    // 1. Create Sims Pulsating Floor Target Marker
    const ringGeom = new THREE.RingGeometry(0.24, 0.38, 32);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.clickMarker = new THREE.Mesh(ringGeom, ringMat);
    this.clickMarker.position.y = 0.04;
    this.clickMarker.visible = false;
    this.scene.add(this.clickMarker);

    // 2. Spawn and Initialize Agents with Sims Behavior
    agents.forEach((agent) => {
      const character = buildAgentCharacter(agent);
      this.scene.add(character.group);

      const deskPos = new THREE.Vector3(...agent.characterPosition);
      const deskRotY = agent.rotationY || 0;

      // Initial persona thoughts
      let initEmoji = '💻';
      let initText = 'En plein dev...';
      if (agent.poleId === 'carole') {
        initEmoji = '🎨';
        initText = 'Harmonie & style';
      } else if (agent.poleId === 'contenu') {
        initEmoji = '🎬';
        initText = 'Création média';
      } else if (agent.poleId === 'personnel') {
        initEmoji = '⚡';
        initText = 'Coordination campus';
      }

      character.setThoughtBubble(initEmoji, initText);
      character.setSittingPose(true, 0);

      this.agentMeshes.set(agent.id, {
        group: character.group,
        character,
        agent,
        deskPos,
        deskRotY,
        currentPos: deskPos.clone(),
        targetPos: null,
        activity: 'desk_working',
        walkCycle: Math.random() * 10,
        idleTimer: 0,
        nextDecisionTime: 14 + Math.random() * 20,
        currentThought: { emoji: initEmoji, text: initText },
      });
    });
  }

  private createPoleLabels() {
    POLES.forEach((pole) => {
      const canvas = document.createElement('canvas');
      canvas.width = 280;
      canvas.height = 76;
      const ctx = canvas.getContext('2d')!;

      // Glass pill
      ctx.fillStyle = 'rgba(6, 10, 18, 0.9)';
      ctx.strokeStyle = pole.accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, 272, 68, 12);
      ctx.fill();
      ctx.stroke();

      // Corner notches
      ctx.fillStyle = pole.accentColor;
      ctx.fillRect(4, 4, 8, 8);
      ctx.fillRect(268, 4, 8, 8);
      ctx.fillRect(4, 64, 8, 8);
      ctx.fillRect(268, 64, 8, 8);

      // Label text
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pole.name.split('—')[0].trim(), 140, 38);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const spriteMat = new THREE.SpriteMaterial({
        map: tex,
        depthTest: false,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3.8, 1.05, 1);
      sprite.position.set(pole.centerCoords.x, 4.2, pole.centerCoords.z);
      sprite.renderOrder = 20;

      this.scene.add(sprite);
      this.poleLabelSprites.set(pole.id, sprite);
    });
  }

  private buildLayers(dataFlows: DataFlowConnection[], projects: Project[]) {
    // 1. FlightRadar 3D Network Layer
    const { group: fGroup, packets } = buildDataFlowCurves(dataFlows);
    fGroup.visible = this.viewMode === 'flightradar';
    this.scene.add(fGroup);
    this.flightRadarGroup = fGroup;
    this.flightPackets = packets;

    // 2. GitHub City Digital Twin Layer
    const gGroup = buildGitHubCityTowers(projects);
    gGroup.visible = this.viewMode === 'github_city';
    this.scene.add(gGroup);
    this.githubCityGroup = gGroup;
  }

  public setViewMode(mode: ViewMode) {
    this.viewMode = mode;
    if (this.flightRadarGroup) {
      this.flightRadarGroup.visible = mode === 'flightradar';
    }
    if (this.githubCityGroup) {
      this.githubCityGroup.visible = mode === 'github_city';
    }
  }

  public setShowLabels(show: boolean) {
    this.showLabels = show;
    this.poleLabelSprites.forEach((sprite) => {
      sprite.visible = show;
    });
  }

  private getOverworldCameraPos(): THREE.Vector3 {
    const width = this.container?.clientWidth || window.innerWidth;
    const height = this.container?.clientHeight || window.innerHeight;
    const aspect = width / height;
    const zoomMultiplier = aspect < 1 ? Math.min(2.1, 0.95 / Math.max(aspect, 0.45)) : 1;
    return new THREE.Vector3(26 * zoomMultiplier, 24 * zoomMultiplier, 26 * zoomMultiplier);
  }

  /**
   * Overworld View
   */
  public resetView() {
    if (this.isFPSMode) {
      this.exitFPSMode();
    }
    this.stopFollowAgent();
    this.trackingAgentId = null;
    this.currentZoomLevel = 'overworld';
    this.callbacks.onCameraLevelChange?.('overworld');
    this.isTransitioning = true;
    this.cameraTargetLookAt.set(0, 1.2, 0);
    this.cameraTargetPosition.copy(this.getOverworldCameraPos());
  }

  /**
   * District / Department View
   */
  public focusOnPole(poleId: PoleId) {
    if (this.isFPSMode) {
      this.exitFPSMode();
    }
    this.stopFollowAgent();
    this.trackingAgentId = null;
    const pole = POLES.find((p) => p.id === poleId);
    if (!pole) return;

    this.currentZoomLevel = 'district';
    this.callbacks.onCameraLevelChange?.('district');
    this.isTransitioning = true;
    this.cameraTargetLookAt.set(...pole.cameraTarget);
    this.cameraTargetPosition.set(...pole.cameraPosition);
  }

  /**
   * Interior Room View
   */
  public enterDistrictInterior(poleId: PoleId) {
    if (this.isFPSMode) {
      this.exitFPSMode();
    }
    this.stopFollowAgent();
    this.trackingAgentId = null;
    const pole = POLES.find((p) => p.id === poleId);
    if (!pole) return;

    this.currentZoomLevel = 'workspace';
    this.callbacks.onCameraLevelChange?.('workspace');
    this.isTransitioning = true;
    this.cameraTargetLookAt.set(...pole.interiorCameraTarget);
    this.cameraTargetPosition.set(...pole.interiorCameraPosition);
  }

  /**
   * Focus camera onto specific agent
   */
  public focusOnAgent(agentId: string, track: boolean = true) {
    if (this.isFPSMode) {
      this.exitFPSMode();
    }
    this.stopFollowAgent();
    const data = this.agentMeshes.get(agentId);
    if (!data) return;

    if (track) {
      this.trackingAgentId = agentId;
    }
    this.currentZoomLevel = 'workspace';
    this.callbacks.onCameraLevelChange?.('workspace');

    const [x, y, z] = data.agent.characterPosition;
    this.isTransitioning = true;
    this.cameraTargetLookAt.set(x, y + 0.8, z);
    this.cameraTargetPosition.set(x + 3.4, y + 2.8, z + 3.4);
    this.setSelectedAgent(agentId);
  }

  /**
   * Classic Sims 45-degree Isometric View
   */
  public setSimsIsometricView() {
    if (this.isFPSMode) {
      this.exitFPSMode();
    }
    this.stopFollowAgent();
    this.trackingAgentId = null;
    this.currentZoomLevel = 'overworld';
    this.callbacks.onCameraLevelChange?.('overworld');
    this.isTransitioning = true;
    this.cameraTargetLookAt.set(0, 0.8, 0);
    this.cameraTargetPosition.set(20, 19, 20);
  }

  /**
   * Start Following Agent with close-up Sims follow camera
   */
  public startFollowAgent(agentId: string) {
    if (this.isFPSMode) {
      this.exitFPSMode();
    }
    const data = this.agentMeshes.get(agentId);
    if (!data) return;

    this.followAgentId = agentId;
    this.trackingAgentId = null;
    this.isTransitioning = false;
    this.currentZoomLevel = 'workspace';
    this.callbacks.onCameraLevelChange?.('workspace');
    this.callbacks.onFollowAgentChange?.(agentId);
    this.setSelectedAgent(agentId);
  }

  /**
   * Stop following current agent
   */
  public stopFollowAgent() {
    if (this.followAgentId) {
      this.followAgentId = null;
      this.callbacks.onFollowAgentChange?.(null);
    }
  }

  public getFollowedAgentId(): string | null {
    return this.followAgentId;
  }

  /**
   * Update character speech/thought bubble directly
   */
  public setAgentThought(agentId: string, emoji: string, text: string) {
    const data = this.agentMeshes.get(agentId);
    if (!data) return;
    data.currentThought = { emoji, text };
    data.character.setThoughtBubble(emoji, text);
  }

  /**
   * Project agent 3D world position to 2D screen coordinates
   */
  public getAgentScreenPos(agentId: string): { x: number; y: number } | null {
    const data = this.agentMeshes.get(agentId);
    if (!data || !this.container) return null;
    const pos = data.currentPos.clone().setY(data.currentPos.y + 1.2);
    pos.project(this.camera);
    if (pos.z > 1) return null; // Behind camera
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    const x = (pos.x * 0.5 + 0.5) * w;
    const y = (-(pos.y * 0.5) + 0.5) * h;
    return { x, y };
  }

  /**
   * Set Simulation Speed Multiplier (0 = Pause, 1 = 1x, 2 = 2x, 4 = 4x)
   */
  public setSimSpeed(speed: number) {
    this.simSpeed = Math.max(0, Math.min(4, speed));
  }

  public getSimSpeed(): number {
    return this.simSpeed;
  }

  /**
   * Set selected agent (turns on Plumbob diamond for this agent)
   */
  public setSelectedAgent(agentId: string | null) {
    this.selectedAgentId = agentId;
    this.agentMeshes.forEach((data, id) => {
      data.character.setSelected(id === agentId);
    });
  }

  /**
   * Command selected agent to walk to specific coordinates
   */
  public sendAgentToCoord(
    agentId: string,
    x: number,
    z: number,
    thoughtEmoji: string = '🚶',
    thoughtText: string = 'En déplacement...'
  ) {
    const data = this.agentMeshes.get(agentId);
    if (!data) return;

    // Trigger Sims Click Marker on Floor
    if (this.clickMarker) {
      this.clickMarker.position.set(x, 0.04, z);
      this.clickMarker.scale.set(1, 1, 1);
      (this.clickMarker.material as THREE.MeshBasicMaterial).opacity = 0.9;
      this.clickMarker.visible = true;
      this.clickMarkerTimer = 0.6;
    }

    data.targetPos = new THREE.Vector3(x, 0, z);
    data.activity = 'walking';
    data.currentThought = { emoji: thoughtEmoji, text: thoughtText };
    data.character.setThoughtBubble(thoughtEmoji, thoughtText);
    data.idleTimer = 0;
  }

  /**
   * Command agent to return to their personal workstation desk
   */
  public sendAgentToDesk(agentId: string) {
    const data = this.agentMeshes.get(agentId);
    if (!data) return;
    this.sendAgentToCoord(agentId, data.deskPos.x, data.deskPos.z, '💻', 'Retour au bureau');
  }

  /**
   * Command agent to walk to the Barista Espresso Machine
   */
  public sendAgentToCoffee(agentId: string) {
    this.sendAgentToCoord(agentId, 0.6, -2.0, '☕', 'Pause Expresso !');
  }

  /**
   * Command agent to walk to the Glass Conference Meeting Room
   */
  public sendAgentToMeeting(agentId: string) {
    this.sendAgentToCoord(agentId, -12.0, 13.5, '🤝', 'Point Réunion');
  }

  /**
   * Command agent to walk to Central Lounge Sofa
   */
  public sendAgentToLounge(agentId: string) {
    this.sendAgentToCoord(agentId, -0.8, 2.2, '🛋️', 'Détente au lounge');
  }

  /**
   * Command agent to inspect the Server Room
   */
  public sendAgentToServers(agentId: string) {
    this.sendAgentToCoord(agentId, -13.5, -12.0, '⚡', 'Inspection serveurs');
  }

  // =========================================================================
  // FIRST-PERSON (FPS) MODE CONTROLS
  // =========================================================================
  public enterFPSMode(agentId: string) {
    const data = this.agentMeshes.get(agentId);
    if (!data) return;

    this.stopFollowAgent();
    this.isFPSMode = true;
    this.fpsAgentId = agentId;
    this.trackingAgentId = null;
    this.isTransitioning = false;
    this.controls.enabled = false;

    const [x, , z] = data.agent.characterPosition;
    this.fpsPlayerPos.set(x, 1.65, z);
    this.fpsYaw = data.agent.rotationY || 0;
    this.fpsPitch = 0;

    const loc = this.getSectorName(x, z);
    this.lastReportedSector = loc;
    this.callbacks.onFPSModeChange?.(true, data.agent.name, loc);
  }

  public exitFPSMode() {
    if (!this.isFPSMode) return;
    const lastId = this.fpsAgentId;
    this.isFPSMode = false;
    this.fpsAgentId = null;
    this.controls.enabled = true;
    this.callbacks.onFPSModeChange?.(false, '', '');

    if (lastId) {
      this.focusOnAgent(lastId, false);
    } else {
      this.resetView();
    }
  }

  public getIsFPSMode(): boolean {
    return this.isFPSMode;
  }

  public getSectorName(x: number, z: number): string {
    if (Math.hypot(x, z) < 4.5) {
      return 'Agora Centrale & Espace Café Lounge';
    }
    if (x < 0 && z < 0) {
      return 'Pôle Tech — Engineering Lab & Baie Serveurs';
    }
    if (x > 0 && z < 0) {
      return 'Maison Carole — Creative Studio & Haute Couture';
    }
    if (x < 0 && z > 0) {
      return 'Pôle Contenu — Media Studio & Salle de Réunion';
    }
    return 'Pôle Personnel — Executive Command Suite';
  }

  private setupEvents() {
    const dom = this.renderer.domElement;

    // Keyboard movement listeners for FPS Mode
    window.addEventListener('keydown', (e) => {
      this.keysPressed[e.code] = true;
      if (e.code === 'Escape' && this.isFPSMode) {
        this.exitFPSMode();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.code] = false;
    });

    // Pointer mouse-look and click inspection
    let downPos = { x: 0, y: 0 };
    dom.addEventListener('pointerdown', (e) => {
      this.isPointerDown = true;
      downPos = { x: e.clientX, y: e.clientY };
      this.lastPointerPos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isFPSMode && this.isPointerDown) {
        const dx = e.clientX - this.lastPointerPos.x;
        const dy = e.clientY - this.lastPointerPos.y;
        this.lastPointerPos = { x: e.clientX, y: e.clientY };

        this.fpsYaw -= dx * 0.0035;
        this.fpsPitch = Math.max(-1.3, Math.min(1.3, this.fpsPitch - dy * 0.0035));
      }
    });

    window.addEventListener('pointerup', () => {
      this.isPointerDown = false;
    });

    // Click raycasting (Works in both Orbit and FPS mode)
    dom.addEventListener('pointerup', (e) => {
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (dist > 8) return; // User was rotating/panning

      const rect = dom.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);

      // 1. Raycast against Agents
      for (const [id, data] of this.agentMeshes.entries()) {
        const hits = this.raycaster.intersectObjects(data.group.children, true);
        if (hits.length > 0) {
          this.setSelectedAgent(id);
          this.callbacks.onSelectAgent(id);
          return;
        }
      }

      // 2. Sims Click-to-Move on Office Floor
      if (this.selectedAgentId && !this.isFPSMode) {
        const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectPoint = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(floorPlane, intersectPoint)) {
          // Within floor boundaries (-17 to +17)
          if (Math.abs(intersectPoint.x) <= 17.2 && Math.abs(intersectPoint.z) <= 17.2) {
            this.sendAgentToCoord(this.selectedAgentId, intersectPoint.x, intersectPoint.z);
            return;
          }
        }
      }

      // 3. Raycast against FlightRadar data conduits (if active)
      if (this.viewMode === 'flightradar' && this.flightRadarGroup) {
        const flowHits = this.raycaster.intersectObjects(this.flightRadarGroup.children, true);
        if (flowHits.length > 0) {
          const hitObj = flowHits[0].object;
          if (hitObj.name && hitObj.name.startsWith('dataflow-')) {
            const flowId = hitObj.name.replace('dataflow-', '');
            this.callbacks.onSelectDataFlow?.(flowId);
            return;
          }
        }
      }

      // 4. Raycast against GitHub City towers (if active)
      if (this.viewMode === 'github_city' && this.githubCityGroup) {
        const towerHits = this.raycaster.intersectObjects(this.githubCityGroup.children, true);
        if (towerHits.length > 0) {
          const hitObj = towerHits[0].object;
          if (hitObj.name && hitObj.name.startsWith('github-tower-')) {
            const projId = hitObj.name.replace('github-tower-', '');
            this.callbacks.onSelectProject?.(projId);
            return;
          }
        }
      }

      // 5. Raycast against Department Hitboxes
      for (const [poleId, box] of this.poleHitboxes.entries()) {
        const hits = this.raycaster.intersectObject(box);
        if (hits.length > 0) {
          this.callbacks.onSelectPole(poleId);
          return;
        }
      }

      // Background click
      if (!this.isFPSMode) {
        this.setSelectedAgent(null);
        this.callbacks.onCanvasClickEmpty();
      }
    });

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize() {
    if (!this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    if (this.currentZoomLevel === 'overworld' && !this.trackingAgentId && !this.isFPSMode) {
      this.cameraTargetPosition.copy(this.getOverworldCameraPos());
      this.isTransitioning = true;
    }
  }

  private tick(time: number) {
    this.animFrameId = requestAnimationFrame(this.tick);

    if (this.isHeadless && time - this.lastRenderTime < 66) {
      return;
    }
    this.lastRenderTime = time;

    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    // A. FPS Mode Movement & Camera
    if (this.isFPSMode) {
      const fwdX = -Math.sin(this.fpsYaw);
      const fwdZ = -Math.cos(this.fpsYaw);
      const rightX = Math.cos(this.fpsYaw);
      const rightZ = -Math.sin(this.fpsYaw);

      let moveX = 0;
      let moveZ = 0;

      // WASD / ZQSD or Arrows
      if (this.keysPressed['KeyW'] || this.keysPressed['KeyZ'] || this.keysPressed['ArrowUp']) {
        moveX += fwdX;
        moveZ += fwdZ;
      }
      if (this.keysPressed['KeyS'] || this.keysPressed['ArrowDown']) {
        moveX -= fwdX;
        moveZ -= fwdZ;
      }
      if (this.keysPressed['KeyA'] || this.keysPressed['KeyQ'] || this.keysPressed['ArrowLeft']) {
        moveX -= rightX;
        moveZ -= rightZ;
      }
      if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) {
        moveX += rightX;
        moveZ += rightZ;
      }

      const isMoving = Math.hypot(moveX, moveZ) > 0.001;
      const isSprint = Boolean(this.keysPressed['ShiftLeft'] || this.keysPressed['ShiftRight']);
      const speed = isSprint ? 7.2 : 3.8;

      if (isMoving) {
        const len = Math.hypot(moveX, moveZ);
        moveX = (moveX / len) * speed * dt;
        moveZ = (moveZ / len) * speed * dt;

        // Clamped inside the office building floor perimeter
        this.fpsPlayerPos.x = THREE.MathUtils.clamp(this.fpsPlayerPos.x + moveX, -17.2, 17.2);
        this.fpsPlayerPos.z = THREE.MathUtils.clamp(this.fpsPlayerPos.z + moveZ, -17.2, 17.2);
        this.stepTimer += dt * (isSprint ? 14 : 9);
      }

      // Subtle Head Bobbing
      const bob = isMoving ? Math.sin(this.stepTimer) * 0.035 : 0;
      this.camera.position.set(this.fpsPlayerPos.x, this.fpsPlayerPos.y + bob, this.fpsPlayerPos.z);

      // Camera orientation from Yaw & Pitch
      const targetLook = new THREE.Vector3(
        this.fpsPlayerPos.x - Math.sin(this.fpsYaw) * Math.cos(this.fpsPitch),
        this.fpsPlayerPos.y + bob + Math.sin(this.fpsPitch),
        this.fpsPlayerPos.z - Math.cos(this.fpsYaw) * Math.cos(this.fpsPitch)
      );
      this.camera.lookAt(targetLook);

      // Sync active agent avatar position with player
      if (this.fpsAgentId) {
        const data = this.agentMeshes.get(this.fpsAgentId);
        if (data) {
          data.group.position.set(this.fpsPlayerPos.x, 0, this.fpsPlayerPos.z);
          data.group.rotation.y = this.fpsYaw;
        }
      }

      // Location change callback
      const currentSector = this.getSectorName(this.fpsPlayerPos.x, this.fpsPlayerPos.z);
      if (currentSector !== this.lastReportedSector) {
        this.lastReportedSector = currentSector;
        this.callbacks.onFPSLocationChange?.(currentSector);
      }
    } else {
      // B. Orbit Mode Camera Transitions & Tracking
      if (this.followAgentId) {
        const simData = this.agentMeshes.get(this.followAgentId);
        if (simData) {
          const charPos = simData.currentPos;
          const targetLookAt = new THREE.Vector3(charPos.x, charPos.y + 0.9, charPos.z);
          // Follow distance: 3.5 units behind and 2.3 units above the moving agent
          const heading = simData.group.rotation.y;
          const targetCamPos = new THREE.Vector3(
            charPos.x - Math.sin(heading) * 3.6,
            charPos.y + 2.3,
            charPos.z - Math.cos(heading) * 3.6
          );

          const alpha = 1 - Math.exp(-6 * dt);
          this.controls.target.lerp(targetLookAt, alpha);
          this.camera.position.lerp(targetCamPos, alpha);
        }
      } else if (this.trackingAgentId) {
        const data = this.agentMeshes.get(this.trackingAgentId);
        if (data) {
          this.cameraTargetLookAt.set(data.currentPos.x, data.currentPos.y + 0.8, data.currentPos.z);
        }
      }

      if (this.isTransitioning && !this.followAgentId) {
        const alpha = 1 - Math.exp(-6 * dt);
        this.controls.target.lerp(this.cameraTargetLookAt, alpha);
        this.camera.position.lerp(this.cameraTargetPosition, alpha);

        if (
          this.camera.position.distanceTo(this.cameraTargetPosition) < 0.1 &&
          this.controls.target.distanceTo(this.cameraTargetLookAt) < 0.1
        ) {
          this.isTransitioning = false;
        }
      }

      this.controls.update();
    }

    // Environmental Animations
    const t = time * 0.001;

    // Pulse Click Marker Ring
    if (this.clickMarker && this.clickMarker.visible) {
      this.clickMarkerTimer -= dt;
      if (this.clickMarkerTimer <= 0) {
        this.clickMarker.visible = false;
      } else {
        const progress = (0.6 - this.clickMarkerTimer) / 0.6;
        const scale = 1 + progress * 1.8;
        this.clickMarker.scale.set(scale, scale, scale);
        (this.clickMarker.material as THREE.MeshBasicMaterial).opacity = 1 - progress;
      }
    }

    // Animated Server Activity LEDs
    if (this.officeComponents?.animatedLEDs) {
      this.officeComponents.animatedLEDs.forEach((led, idx) => {
        led.visible = Math.sin(t * (6 + idx * 2)) > -0.2;
      });
    }

    // FlightRadar Animated Data Packets
    if (this.viewMode === 'flightradar') {
      this.flightPackets.forEach((p) => {
        p.progress = (p.progress + p.speed) % 1;
        const pt = p.curve.getPointAt(p.progress);
        p.mesh.position.copy(pt);
      });
    }

    // =========================================================================
    // REAL-TIME SIMS AUTONOMOUS ENGINE & AGENT ANIMATIONS
    // =========================================================================
    const speedMult = this.simSpeed;

    this.agentMeshes.forEach((simData) => {
      const { character, agent, group } = simData;

      // Skip simulation for agent currently under FPS direct player control
      if (this.isFPSMode && this.fpsAgentId === agent.id) return;

      // 1. Plumbob Diamond Rotation & Bobbing
      if (character.plumbobMesh.visible) {
        character.plumbobMesh.rotation.y = t * 3.5;
        character.plumbobMesh.position.y = 1.64 + Math.sin(t * 4) * 0.04;
      }

      // 2. Gentle Thought Bubble Floating
      character.thoughtSprite.position.y = 1.95 + Math.sin(t * 2 + group.id) * 0.03;

      // 3. Movement Towards Target Waypoint
      if (simData.targetPos) {
        const dist = simData.currentPos.distanceTo(simData.targetPos);

        if (dist > 0.14) {
          const dir = simData.targetPos.clone().sub(simData.currentPos).normalize();
          const targetRot = Math.atan2(dir.x, dir.z);

          // Smooth turning towards walking heading
          group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRot, Math.min(1, dt * 8));

          // Forward walking speed scaled by sim speed
          const walkSpeed = speedMult > 0 ? 2.6 * speedMult : 0;
          simData.currentPos.addScaledVector(dir, walkSpeed * dt);
          group.position.set(simData.currentPos.x, 0, simData.currentPos.z);

          // Articulated walking limb cycle
          simData.walkCycle += dt * 8 * Math.max(1, speedMult);
          character.setWalkingPose(simData.walkCycle);
        } else {
          // Arrived at destination waypoint!
          simData.targetPos = null;

          // Check which zone we arrived at:
          const distToDesk = simData.currentPos.distanceTo(simData.deskPos);
          if (distToDesk < 0.6) {
            simData.activity = 'desk_working';
            group.rotation.y = simData.deskRotY;
            simData.currentPos.copy(simData.deskPos);
            group.position.copy(simData.deskPos);
            character.setSittingPose(true, t);
            character.setThoughtBubble('💻', 'Au bureau');
          } else if (simData.currentPos.distanceTo(new THREE.Vector3(0.6, 0, -2.0)) < 1.6) {
            simData.activity = 'coffee_break';
            character.setThoughtBubble('☕', 'Expresso chaud');
          } else if (simData.currentPos.distanceTo(new THREE.Vector3(-12.0, 0, 13.5)) < 2.5) {
            simData.activity = 'in_meeting';
            character.setSittingPose(false, t);
            character.setThoughtBubble('🤝', 'Brainstorming');
          } else if (simData.currentPos.distanceTo(new THREE.Vector3(-0.8, 0, 2.2)) < 1.6) {
            simData.activity = 'socializing';
            character.setSittingPose(false, t);
            character.setThoughtBubble('🛋️', 'Détente lounge');
          } else {
            simData.activity = 'walking';
            character.setIdlePose(t);
          }
        }
      } else {
        // Agent is stationary at a workstation or POI
        if (simData.activity === 'desk_working') {
          character.setSittingPose(true, t);
        } else if (simData.activity === 'in_meeting' || simData.activity === 'socializing') {
          character.setSittingPose(false, t);
        } else {
          character.setIdlePose(t);
        }

        // 4. Autonomous Sims Decision Routines (Only when speed > 0)
        if (speedMult > 0) {
          simData.idleTimer += dt * speedMult;

          if (simData.idleTimer >= simData.nextDecisionTime) {
            simData.idleTimer = 0;
            simData.nextDecisionTime = 16 + Math.random() * 26;

            if (simData.activity === 'desk_working') {
              // Time for a break! Pick an autonomous destination
              const rand = Math.random();
              if (rand < 0.45) {
                // Grab a coffee
                this.sendAgentToCoffee(agent.id);
              } else if (rand < 0.75) {
                // Go to meeting room
                this.sendAgentToMeeting(agent.id);
              } else {
                // Relax on sofa
                this.sendAgentToLounge(agent.id);
              }
            } else {
              // Return to desk to continue working
              this.sendAgentToDesk(agent.id);
            }
          }
        }
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
