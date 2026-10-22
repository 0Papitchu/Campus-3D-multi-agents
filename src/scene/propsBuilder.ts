import * as THREE from 'three';
import {
  createCyberGridTexture,
  createHexPlatformTexture,
  createHoloScreenTexture,
  createStatusIconTexture,
} from './proceduralTextures.ts';
import type { Agent, AgentState, DataFlowConnection, Project } from '../types/world.ts';

// Pre-cached textures
const holoScreenTech = createHoloScreenTexture('tech');
const holoScreenCarole = createHoloScreenTexture('carole');
const holoScreenContenu = createHoloScreenTexture('contenu');
const holoScreenPerso = createHoloScreenTexture('personnel');

const statusTextures: Record<AgentState, THREE.CanvasTexture> = {
  idle: createStatusIconTexture('idle'),
  working: createStatusIconTexture('working'),
  thinking: createStatusIconTexture('thinking'),
  waiting: createStatusIconTexture('waiting'),
  review: createStatusIconTexture('review'),
  done: createStatusIconTexture('done'),
  error: createStatusIconTexture('error'),
  offline: createStatusIconTexture('offline'),
};

/**
 * Creates soft radial contact shadow disc
 */
export function createContactShadow(radius: number = 0.5): THREE.Mesh {
  const geom = new THREE.CircleGeometry(radius, 16);
  geom.rotateX(-Math.PI / 2);

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    opacity: 0.85,
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.y = 0.02;
  mesh.renderOrder = 1;
  return mesh;
}

/**
 * Pôle Tech — Engineering Lab (Sci-Fi High Tech)
 */
export function buildTechPavilion(): { group: THREE.Group; coreCrystal: THREE.Mesh } {
  const group = new THREE.Group();
  group.position.set(-9, 0, -9);

  // 1. Hex Platform with cyan neon trim
  const platMat = new THREE.MeshStandardMaterial({
    map: createHexPlatformTexture('#00f0ff'),
    metalness: 0.8,
    roughness: 0.25,
  });
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 0.25, 6), platMat);
  platform.position.y = 0.125;
  platform.receiveShadow = true;
  group.add(platform);

  // Cyan glowing perimeter ring
  const ringGeom = new THREE.RingGeometry(4.2, 4.35, 6);
  ringGeom.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeom, ringMat);
  ring.position.y = 0.26;
  group.add(ring);

  // 2. Quantum Computing Core with Rotating Crystal
  const coreBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 1.0, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 })
  );
  coreBase.position.set(0, 0.45, 0);
  group.add(coreBase);

  // Floating Quantum Crystal
  const crystalGeom = new THREE.OctahedronGeometry(0.5, 0);
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    transmission: 0.8,
    thickness: 1.0,
  });
  const coreCrystal = new THREE.Mesh(crystalGeom, crystalMat);
  coreCrystal.position.set(0, 1.4, 0);
  group.add(coreCrystal);

  // Core energy beam
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
  );
  beam.position.set(0, 1.8, 0);
  group.add(beam);

  // 3. Cyber Workstations with Curved Holographic Code Screens
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.8, roughness: 0.3 });
  const desk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.0), deskMat);
  desk.position.set(-1.8, 0.85, -1.8);
  desk.rotation.y = Math.PI / 4;
  group.add(desk);

  // Dual Curved Screens with IDE Code
  const holoScreenGeom = new THREE.PlaneGeometry(1.4, 0.85);
  const holoScreenMat = new THREE.MeshBasicMaterial({
    map: holoScreenTech,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });
  const holoScreen = new THREE.Mesh(holoScreenGeom, holoScreenMat);
  holoScreen.position.set(-2.0, 1.45, -2.0);
  holoScreen.rotation.y = Math.PI / 4;
  group.add(holoScreen);

  // 4. Cryogenic Server Blade Racks
  const serverRack = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 2.4, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x050914, metalness: 0.9, roughness: 0.2 })
  );
  serverRack.position.set(2.2, 1.3, -1.8);
  serverRack.rotation.y = -Math.PI / 6;
  group.add(serverRack);

  // Server rack LEDs
  for (let i = 0; i < 7; i++) {
    const led = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.04, 0.02),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00f0ff : 0x818cf8 })
    );
    led.position.set(0, -0.9 + i * 0.3, 0.41);
    serverRack.add(led);
  }

  return { group, coreCrystal };
}

/**
 * Maison Carole — Creative House (Luxury Sci-Fi Atelier)
 */
export function buildCarolePavilion(): { group: THREE.Group; prismGem: THREE.Mesh } {
  const group = new THREE.Group();
  group.position.set(9, 0, -9);

  // 1. Faceted Obsidian Platform with Rose Gold Trim
  const platMat = new THREE.MeshStandardMaterial({
    map: createHexPlatformTexture('#f43f5e'),
    metalness: 0.85,
    roughness: 0.2,
  });
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 0.25, 6), platMat);
  platform.position.y = 0.125;
  platform.receiveShadow = true;
  group.add(platform);

  // Rose Gold glowing trim
  const ringGeom = new THREE.RingGeometry(4.2, 4.35, 6);
  ringGeom.rotateX(-Math.PI / 2);
  const ring = new THREE.Mesh(
    ringGeom,
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide })
  );
  ring.position.y = 0.26;
  group.add(ring);

  // 2. Prismatic Architectural Canopy
  const canopyMat = new THREE.MeshPhysicalMaterial({
    color: 0xfb7185,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    transmission: 0.85,
    thickness: 0.8,
  });
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(3.6, 1.2, 6, 1, true), canopyMat);
  canopy.position.set(0, 3.2, 0);
  canopy.rotation.y = Math.PI / 6;
  group.add(canopy);

  // Pylon supports
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const pylon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 3.0, 8),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 })
    );
    pylon.position.set(Math.cos(angle) * 3.4, 1.6, Math.sin(angle) * 3.4);
    group.add(pylon);
  }

  // 3. Holographic Moodboard Screen
  const moodScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.0),
    new THREE.MeshBasicMaterial({
      map: holoScreenCarole,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
  );
  moodScreen.position.set(-1.8, 1.6, -1.8);
  moodScreen.rotation.y = Math.PI / 4;
  group.add(moodScreen);

  // 4. Digital Haute Couture Mannequin with Neon Wireframe
  const mannequinGroup = new THREE.Group();
  mannequinGroup.position.set(1.8, 0.25, -1.5);

  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 1.3, 8),
    new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 })
  );
  stand.position.y = 0.65;
  mannequinGroup.add(stand);

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.28, 0.7, 10),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xbe123c,
      emissiveIntensity: 0.4,
      roughness: 0.3,
    })
  );
  torso.position.y = 1.25;
  mannequinGroup.add(torso);

  // Floating Color Prism Gem
  const prismGeom = new THREE.IcosahedronGeometry(0.35, 0);
  const prismMat = new THREE.MeshPhysicalMaterial({
    color: 0xfde047,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.5,
    roughness: 0.1,
    transmission: 0.9,
  });
  const prismGem = new THREE.Mesh(prismGeom, prismMat);
  prismGem.position.set(0, 1.6, 0.8);
  group.add(prismGem);

  group.add(mannequinGroup);
  return { group, prismGem };
}

/**
 * Pôle Contenu — Media Studio (Cyber-Broadcast Stage)
 */
export function buildContenuPavilion(): { group: THREE.Group; droneCamera: THREE.Group } {
  const group = new THREE.Group();
  group.position.set(-9, 0, 9);

  // 1. Studio Platform with Purple Neon Trim
  const platMat = new THREE.MeshStandardMaterial({
    map: createHexPlatformTexture('#c084fc'),
    metalness: 0.85,
    roughness: 0.2,
  });
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 0.25, 6), platMat);
  platform.position.y = 0.125;
  platform.receiveShadow = true;
  group.add(platform);

  // Purple glowing trim
  const ringGeom = new THREE.RingGeometry(4.2, 4.35, 6);
  ringGeom.rotateX(-Math.PI / 2);
  const ring = new THREE.Mesh(
    ringGeom,
    new THREE.MeshBasicMaterial({ color: 0xc084fc, side: THREE.DoubleSide })
  );
  ring.position.y = 0.26;
  group.add(ring);

  // 2. Curved Virtual Cyclorama (Broadcast screen)
  const cycGeom = new THREE.CylinderGeometry(2.8, 2.8, 2.2, 16, 1, true, 0, Math.PI / 1.5);
  const cycMat = new THREE.MeshBasicMaterial({
    color: 0x10b981, // Chromatic green
    side: THREE.BackSide,
  });
  const cyc = new THREE.Mesh(cycGeom, cycMat);
  cyc.position.set(-1.0, 1.35, -1.0);
  cyc.rotation.y = 0.5;
  group.add(cyc);

  // 3. Robotic Arm Cinema Camera
  const camGroup = new THREE.Group();
  camGroup.position.set(-1.6, 0.25, 1.5);
  camGroup.rotation.y = -Math.PI / 3.8;

  const camBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.35, 0.2, 10),
    new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 })
  );
  camGroup.add(camBase);

  const camArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.9 })
  );
  camArm.position.set(0, 0.8, 0);
  camArm.rotation.z = 0.2;
  camGroup.add(camArm);

  const camBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.3, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9 })
  );
  camBody.position.set(0.15, 1.4, 0);
  camGroup.add(camBody);

  // Glowing lens ring
  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.2, 12),
    new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0xc084fc,
      emissiveIntensity: 0.8,
    })
  );
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0.15, 1.4, -0.32);
  camGroup.add(lens);
  group.add(camGroup);

  // 4. Floating Broadcast Drone
  const droneCamera = new THREE.Group();
  droneCamera.position.set(1.5, 2.2, -1.4);
  const droneBody = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9, roughness: 0.2 })
  );
  droneCamera.add(droneBody);

  const droneEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xc084fc })
  );
  droneEye.position.set(0, 0, 0.22);
  droneCamera.add(droneEye);
  group.add(droneCamera);

  // 5. Video Timeline Screen
  const holoTimeline = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.95),
    new THREE.MeshBasicMaterial({
      map: holoScreenContenu,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
  );
  holoTimeline.position.set(1.6, 1.4, 1.2);
  holoTimeline.rotation.y = -Math.PI / 4;
  group.add(holoTimeline);

  return { group, droneCamera };
}

/**
 * Pôle Personnel — Command Center (Central Nexus & Executive Terminal)
 */
export function buildPersonnelPavilion(): { group: THREE.Group; radarSphere: THREE.Mesh } {
  const group = new THREE.Group();
  group.position.set(9, 0, 9);

  // 1. Orbital Platform with Emerald Neon Trim
  const platMat = new THREE.MeshStandardMaterial({
    map: createHexPlatformTexture('#34d399'),
    metalness: 0.85,
    roughness: 0.2,
  });
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 0.25, 6), platMat);
  platform.position.y = 0.125;
  platform.receiveShadow = true;
  group.add(platform);

  // Emerald glowing trim
  const ringGeom = new THREE.RingGeometry(4.2, 4.35, 6);
  ringGeom.rotateX(-Math.PI / 2);
  const ring = new THREE.Mesh(
    ringGeom,
    new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide })
  );
  ring.position.y = 0.26;
  group.add(ring);

  // 2. Center Holographic Tactical Globe / Radar
  const radarGeom = new THREE.SphereGeometry(0.65, 16, 16);
  const radarMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    wireframe: true,
    transparent: true,
    opacity: 0.7,
  });
  const radarSphere = new THREE.Mesh(radarGeom, radarMat);
  radarSphere.position.set(0, 1.5, 0);
  group.add(radarSphere);

  const radarPedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.7, 0.8, 12),
    new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.9 })
  );
  radarPedestal.position.set(0, 0.5, 0);
  group.add(radarPedestal);

  // 3. NASA-Style Multi-Tiered Command Monitor
  const cmdMonitor = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.95),
    new THREE.MeshBasicMaterial({
      map: holoScreenPerso,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
  );
  cmdMonitor.position.set(-1.8, 1.45, -1.2);
  cmdMonitor.rotation.y = Math.PI / 4;
  group.add(cmdMonitor);

  // 4. Tactical Dispatch Console
  const consoleDesk = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.15, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
  );
  consoleDesk.position.set(1.4, 0.85, 1.4);
  consoleDesk.rotation.y = -Math.PI / 4;
  group.add(consoleDesk);

  return { group, radarSphere };
}

/**
 * Builds Central Multiversal Core & Island Megastructure
 */
export function buildCentralMegastructure(): {
  group: THREE.Group;
  reactorCore: THREE.Mesh;
  energyRings: THREE.Mesh[];
} {
  const group = new THREE.Group();

  // Central Reactor Platform
  const corePlat = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 2.9, 0.45, 24),
    new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.9, roughness: 0.2 })
  );
  corePlat.position.y = 0.25;
  corePlat.receiveShadow = true;
  group.add(corePlat);

  // Central Pulsating Reactor Core
  const reactorGeom = new THREE.IcosahedronGeometry(0.85, 1);
  const reactorMat = new THREE.MeshPhysicalMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.8,
    roughness: 0.1,
    transmission: 0.7,
  });
  const reactorCore = new THREE.Mesh(reactorGeom, reactorMat);
  reactorCore.position.set(0, 1.6, 0);
  group.add(reactorCore);

  // Concentric Energy Rings
  const energyRings: THREE.Mesh[] = [];
  const ringColors = [0x00f0ff, 0x818cf8, 0x34d399];
  for (let i = 0; i < 3; i++) {
    const rGeom = new THREE.TorusGeometry(1.2 + i * 0.4, 0.03, 8, 32);
    const rMat = new THREE.MeshBasicMaterial({ color: ringColors[i] });
    const ringMesh = new THREE.Mesh(rGeom, rMat);
    ringMesh.position.set(0, 1.6, 0);
    ringMesh.rotation.x = Math.PI / 2 + (i * Math.PI) / 6;
    group.add(ringMesh);
    energyRings.push(ringMesh);
  }

  // Energy Conduit Bridges to the 4 Districts
  const conduitMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x0284c7,
    emissiveIntensity: 0.7,
    roughness: 0.3,
  });

  const bridge1 = new THREE.Mesh(new THREE.BoxGeometry(22, 0.05, 0.4), conduitMat);
  bridge1.position.set(0, 0.08, 0);
  bridge1.rotation.y = Math.PI / 4;
  group.add(bridge1);

  const bridge2 = new THREE.Mesh(new THREE.BoxGeometry(22, 0.05, 0.4), conduitMat);
  bridge2.position.set(0, 0.08, 0);
  bridge2.rotation.y = -Math.PI / 4;
  group.add(bridge2);

  return { group, reactorCore, energyRings };
}

/**
 * Generates an ultra-crisp Sims-style speech/thought bubble canvas texture
 */
export function createSimsBubbleTexture(emoji: string, text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 130;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bubble cloud / pill body
  const x = 12;
  const y = 8;
  const w = 296;
  const h = 88;
  const r = 24;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  // Background gradient (clean translucent white to ice blue)
  const grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
  grad.addColorStop(1, 'rgba(240, 249, 255, 0.94)');
  ctx.fillStyle = grad;

  // Draw speech bubble path with arrow pointer at bottom
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);

  // Tail arrow
  ctx.lineTo(x + w / 2 + 16, y + h);
  ctx.lineTo(x + w / 2, y + h + 22);
  ctx.lineTo(x + w / 2 - 12, y + h);

  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Subtle border
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw Emoji
  ctx.font = '36px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji || '💭', 48, y + h / 2);

  // Draw Text
  ctx.font = 'bold 20px "Inter", "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Truncate text if needed
  let display = text || 'En réflexion...';
  if (display.length > 20) {
    display = display.slice(0, 19) + '…';
  }
  ctx.fillText(display, 88, y + h / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Builds Sims-style 3D Agent Character with articulated limbs, Plumbob and Thought Bubble
 */
export function buildAgentCharacter(agent: Agent): {
  group: THREE.Group;
  statusSprite: THREE.Sprite;
  thoughtSprite: THREE.Sprite;
  plumbobMesh: THREE.Mesh;
  bodyMesh: THREE.Mesh;
  headMesh: THREE.Mesh;
  visor: THREE.Mesh;
  chestCore: THREE.Mesh;
  haloRing: THREE.Mesh;
  leftLegGroup: THREE.Group;
  rightLegGroup: THREE.Group;
  leftArmGroup: THREE.Group;
  rightArmGroup: THREE.Group;
  updateStatus: (newState: AgentState) => void;
  setThoughtBubble: (emoji: string, text: string) => void;
  setSelected: (selected: boolean) => void;
  setWalkingPose: (walkCycle: number) => void;
  setSittingPose: (isTyping: boolean, time: number) => void;
  setIdlePose: (time: number) => void;
} {
  const group = new THREE.Group();
  group.position.set(...agent.characterPosition);
  group.rotation.y = agent.rotationY;
  group.name = `agent-${agent.id}`;

  const shadow = createContactShadow(0.45);
  group.add(shadow);

  // Materials
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.9,
    roughness: 0.25,
  });
  const armorMat = new THREE.MeshStandardMaterial({
    color: agent.clothesColor,
    metalness: 0.6,
    roughness: 0.35,
  });
  const coreMat = new THREE.MeshBasicMaterial({
    color: agent.status === 'error' ? 0xf43f5e : 0x00f0ff,
  });

  // 1. Articulated Legs with Hip Pivots
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.11, 0.38, 0); // Hip joint
  const leftLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.38, 8), chassisMat);
  leftLegMesh.position.set(0, -0.19, 0);
  leftLegGroup.add(leftLegMesh);
  group.add(leftLegGroup);

  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.11, 0.38, 0); // Hip joint
  const rightLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.38, 8), chassisMat);
  rightLegMesh.position.set(0, -0.19, 0);
  rightLegGroup.add(rightLegMesh);
  group.add(rightLegGroup);

  // 2. Torso with Chest Arc Core
  const bodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.52, 8), armorMat);
  bodyMesh.position.y = 0.6;
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Glowing Chest Core
  const chestCore = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), coreMat);
  chestCore.position.set(0, 0.65, 0.21);
  group.add(chestCore);

  // 3. Cybernetic Head with Visor
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), chassisMat);
  headMesh.position.y = 1.08;
  headMesh.castShadow = true;
  group.add(headMesh);

  // Ocular optic visor
  const visorMat = new THREE.MeshBasicMaterial({
    color: agent.status === 'error' ? 0xf43f5e : 0x38bdf8,
  });
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.08), visorMat);
  visor.position.set(0, 1.08, 0.18);
  group.add(visor);

  // 4. Articulated Arms with Shoulder Pivots
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.28, 0.8, 0.04); // Shoulder joint
  const leftArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.38, 8), chassisMat);
  leftArmMesh.position.set(0, -0.19, 0);
  leftArmGroup.add(leftArmMesh);
  group.add(leftArmGroup);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.28, 0.8, 0.04); // Shoulder joint
  const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.38, 8), chassisMat);
  rightArmMesh.position.set(0, -0.19, 0);
  rightArmGroup.add(rightArmMesh);
  group.add(rightArmGroup);

  // 5. Planetary / Holographic Halo for THINKING / REVIEW states
  const haloGeom = new THREE.TorusGeometry(0.34, 0.02, 6, 24);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    transparent: true,
    opacity: agent.status === 'thinking' || agent.status === 'review' ? 0.9 : 0.0,
  });
  const haloRing = new THREE.Mesh(haloGeom, haloMat);
  haloRing.position.set(0, 1.15, 0);
  haloRing.rotation.x = Math.PI / 3;
  group.add(haloRing);

  const isCEO = agent.id === 'ceo-orchestrator';

  // 5.5 Golden Crown for CEO Orchestrator
  if (isCEO) {
    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, 1.32, 0);
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
    });
    // Base ring
    const baseBand = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.08, 6), crownMat);
    crownGroup.add(baseBand);
    // 6 crown points
    for (let p = 0; p < 6; p++) {
      const angle = (p * Math.PI * 2) / 6;
      const point = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 4), crownMat);
      point.position.set(Math.cos(angle) * 0.23, 0.09, Math.sin(angle) * 0.23);
      crownGroup.add(point);
    }
    group.add(crownGroup);
  }

  // 6. THE ICONIC SIMS PLUMBOB (Emerald Diamond hovering and spinning, or Royal Gold for CEO)
  const plumbobGeom = new THREE.OctahedronGeometry(0.14, 0);
  plumbobGeom.scale(0.7, 1.4, 0.7);
  const plumbobMat = new THREE.MeshStandardMaterial({
    color: isCEO ? 0xfbbf24 : 0x22c55e,
    emissive: isCEO ? 0xd97706 : 0x16a34a,
    emissiveIntensity: isCEO ? 1.0 : 0.8,
    metalness: isCEO ? 0.8 : 0.2,
    roughness: 0.15,
  });
  const plumbobMesh = new THREE.Mesh(plumbobGeom, plumbobMat);
  plumbobMesh.position.set(0, isCEO ? 1.72 : 1.62, 0);
  plumbobMesh.visible = isCEO; // CEO always displays golden plumbob
  group.add(plumbobMesh);

  // 7. Dynamic Sims Speech / Thought Bubble
  const initialThoughtTex = createSimsBubbleTexture(
    isCEO ? '👑' : agent.status === 'working' ? '💻' : agent.status === 'thinking' ? '💡' : '☕',
    agent.name
  );
  const thoughtMat = new THREE.SpriteMaterial({
    map: initialThoughtTex,
    depthTest: false,
    depthWrite: false,
  });
  const thoughtSprite = new THREE.Sprite(thoughtMat);
  thoughtSprite.scale.set(1.4, 0.58, 1);
  thoughtSprite.position.set(0, 1.95, 0);
  thoughtSprite.renderOrder = 30;
  group.add(thoughtSprite);

  // Legacy mini status icon (small badge right under the thought bubble)
  const spriteMat = new THREE.SpriteMaterial({
    map: statusTextures[agent.status] || statusTextures.idle,
    depthTest: false,
    depthWrite: false,
  });
  const statusSprite = new THREE.Sprite(spriteMat);
  statusSprite.scale.set(0.32, 0.32, 1);
  statusSprite.position.set(0, 1.55, 0);
  statusSprite.renderOrder = 10;
  group.add(statusSprite);

  // Interactive update methods
  const updateStatus = (newState: AgentState) => {
    spriteMat.map = statusTextures[newState] || statusTextures.idle;
    spriteMat.needsUpdate = true;

    const isErr = newState === 'error';
    const isOffline = newState === 'offline';
    (visor.material as THREE.MeshBasicMaterial).color.setHex(
      isErr ? 0xf43f5e : isOffline ? 0x475569 : 0x38bdf8
    );
    (chestCore.material as THREE.MeshBasicMaterial).color.setHex(
      isErr ? 0xf43f5e : isOffline ? 0x1e293b : 0x00f0ff
    );

    // Adjust Plumbob color according to state/mood
    if (isErr) {
      plumbobMat.color.setHex(0xf43f5e);
      plumbobMat.emissive.setHex(0xe11d48);
    } else if (newState === 'thinking' || newState === 'waiting') {
      plumbobMat.color.setHex(0xfbbf24);
      plumbobMat.emissive.setHex(0xd97706);
    } else {
      plumbobMat.color.setHex(0x22c55e);
      plumbobMat.emissive.setHex(0x16a34a);
    }

    haloMat.opacity = newState === 'thinking' || newState === 'review' ? 0.9 : 0.0;
  };

  const setThoughtBubble = (emoji: string, text: string) => {
    const tex = createSimsBubbleTexture(emoji, text);
    thoughtMat.map?.dispose();
    thoughtMat.map = tex;
    thoughtMat.needsUpdate = true;
  };

  const setSelected = (selected: boolean) => {
    plumbobMesh.visible = selected;
    thoughtSprite.scale.set(selected ? 1.7 : 1.35, selected ? 0.7 : 0.55, 1);
  };

  const setWalkingPose = (walkCycle: number) => {
    leftLegGroup.rotation.x = Math.sin(walkCycle) * 0.48;
    rightLegGroup.rotation.x = -Math.sin(walkCycle) * 0.48;
    leftArmGroup.rotation.x = -Math.sin(walkCycle) * 0.38;
    rightArmGroup.rotation.x = Math.sin(walkCycle) * 0.38;
    bodyMesh.position.y = 0.6 + Math.abs(Math.sin(walkCycle)) * 0.04;
    headMesh.rotation.x = 0;
  };

  const setSittingPose = (isTyping: boolean, time: number) => {
    leftLegGroup.rotation.x = 1.35; // Sitting bent forward
    rightLegGroup.rotation.x = 1.35;
    if (isTyping) {
      leftArmGroup.rotation.x = -0.9 + Math.sin(time * 12) * 0.06;
      rightArmGroup.rotation.x = -0.9 + Math.cos(time * 12) * 0.06;
      headMesh.rotation.x = 0.12 + Math.sin(time * 3) * 0.04;
    } else {
      leftArmGroup.rotation.x = -0.6;
      rightArmGroup.rotation.x = -0.6;
      headMesh.rotation.x = 0.05;
    }
    bodyMesh.position.y = 0.52; // Lowered onto seat
  };

  const setIdlePose = (time: number) => {
    leftLegGroup.rotation.x = 0;
    rightLegGroup.rotation.x = 0;
    leftArmGroup.rotation.x = Math.sin(time * 2) * 0.05;
    rightArmGroup.rotation.x = -Math.sin(time * 2) * 0.05;
    bodyMesh.position.y = 0.6 + Math.sin(time * 2) * 0.01;
    headMesh.rotation.y = Math.sin(time * 1.2) * 0.1;
  };

  return {
    group,
    statusSprite,
    thoughtSprite,
    plumbobMesh,
    bodyMesh,
    headMesh,
    visor,
    chestCore,
    haloRing,
    leftLegGroup,
    rightLegGroup,
    leftArmGroup,
    rightArmGroup,
    updateStatus,
    setThoughtBubble,
    setSelected,
    setWalkingPose,
    setSittingPose,
    setIdlePose,
  };
}

/**
 * Builds 3D Data Flow Arcs for FlightRadar Mode
 */
export function buildDataFlowCurves(flows: DataFlowConnection[]): {
  group: THREE.Group;
  packets: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; speed: number; progress: number }[];
} {
  const group = new THREE.Group();
  group.name = 'flightradar-network-layer';
  const packets: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; speed: number; progress: number }[] = [];

  flows.forEach((flow) => {
    const points = flow.curvePoints.map((pt) => new THREE.Vector3(...pt));
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.04, 6, false);

    const colors = {
      active: 0x00f0ff,
      queued: 0xfbbf24,
      completed: 0x10b981,
      blocked: 0xf43f5e,
    };
    const tubeColor = colors[flow.status] || 0x00f0ff;

    const tubeMat = new THREE.MeshBasicMaterial({
      color: tubeColor,
      transparent: true,
      opacity: flow.status === 'active' ? 0.85 : 0.45,
    });
    const tube = new THREE.Mesh(tubeGeom, tubeMat);
    tube.name = `dataflow-${flow.id}`;
    group.add(tube);

    // Glowing data packet particle moving along curve
    if (flow.status === 'active') {
      const pGeom = new THREE.SphereGeometry(0.12, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const packet = new THREE.Mesh(pGeom, pMat);
      group.add(packet);

      packets.push({
        mesh: packet,
        curve,
        speed: 0.008 + (flow.latencyMs > 50 ? 0.003 : 0.012),
        progress: Math.random(),
      });
    }
  });

  return { group, packets };
}

/**
 * Builds GitHub City / Digital Twin Monolith Towers
 */
export function buildGitHubCityTowers(projects: Project[]): THREE.Group {
  const group = new THREE.Group();
  group.name = 'github-city-layer';

  const districtOffsets: Record<string, [number, number]> = {
    tech: [-9, -9],
    carole: [9, -9],
    contenu: [-9, 9],
    personnel: [9, 9],
  };

  projects.forEach((proj, idx) => {
    const offset = districtOffsets[proj.districtId] || [0, 0];
    const height = 1.2 + proj.tasksCount * 0.18; // Height directly proportional to tasks

    const towerGeom = new THREE.BoxGeometry(1.2, height, 1.2);
    const towerMat = new THREE.MeshStandardMaterial({
      color: proj.health === 'critical' ? 0xf43f5e : proj.health === 'warning' ? 0xfbbf24 : 0x0284c7,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const tower = new THREE.Mesh(towerGeom, towerMat);
    tower.position.set(offset[0] + 2.5, height / 2 + 0.2, offset[1] + 2.5);
    tower.name = `github-tower-${proj.id}`;
    group.add(tower);

    // Holographic top beacon
    const beacon = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.3, 0),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    beacon.position.set(offset[0] + 2.5, height + 0.5, offset[1] + 2.5);
    group.add(beacon);
  });

  return group;
}
