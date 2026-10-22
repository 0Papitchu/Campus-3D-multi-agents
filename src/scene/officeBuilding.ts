import * as THREE from 'three';
import {
  createWoodParquetTexture,
  createOfficeCarpetTexture,
  createPolishedTerrazzoTexture,
  createBuildingFacadeTexture,
  createServerRackTexture,
  createHoloScreenTexture,
} from './proceduralTextures.ts';
import type { PoleId } from '../types/world.ts';

export interface OfficeBuildingComponents {
  group: THREE.Group;
  animatedLEDs: THREE.Mesh[];
  screenMeshes: THREE.Mesh[];
  poleHitboxes: Map<PoleId, THREE.Mesh>;
}

/**
 * Creates a modern ergonomic office desk with dual monitors, keyboard, and swivel mesh chair
 */
function createWorkstationDesk(
  x: number,
  z: number,
  rotY: number = 0,
  accentColor: string = '#00f0ff',
  screenType: 'tech' | 'carole' | 'contenu' | 'personnel' = 'tech'
): THREE.Group {
  const deskGroup = new THREE.Group();
  deskGroup.position.set(x, 0, z);
  deskGroup.rotation.y = rotY;

  // 1. Tabletop (Modern Scandinavian white/natural wood finish)
  const topMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9, // Clean matte white desk top
    roughness: 0.35,
    metalness: 0.1,
  });
  const tabletop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.2), topMat);
  tabletop.position.y = 0.74;
  tabletop.castShadow = true;
  tabletop.receiveShadow = true;
  deskGroup.add(tabletop);

  // 2. Beveled Metal Desk Frame & Legs (Black aluminum)
  const legMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.8,
  });
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.74, 1.1), legMat);
  legL.position.set(-1.12, 0.37, 0);
  legL.castShadow = true;
  deskGroup.add(legL);

  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.74, 1.1), legMat);
  legR.position.set(1.12, 0.37, 0);
  legR.castShadow = true;
  deskGroup.add(legR);

  // Cross beam
  const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 0.06), legMat);
  crossBeam.position.set(0, 0.4, -0.3);
  deskGroup.add(crossBeam);

  // 3. Acoustic Fabric Privacy Screen / Desk Divider
  const dividerMat = new THREE.MeshStandardMaterial({
    color: accentColor === '#00f0ff' ? 0x0369a1 : 0x334155,
    roughness: 0.9,
    metalness: 0.05,
  });
  const divider = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.45, 0.04), dividerMat);
  divider.position.set(0, 0.96, -0.56);
  divider.castShadow = true;
  deskGroup.add(divider);

  // 4. Dual Widescreen Monitors with Articulated Arm
  const screenTex = createHoloScreenTexture(screenType);
  const monitorMat = new THREE.MeshBasicMaterial({ map: screenTex });
  const casingMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.5, metalness: 0.7 });

  // Monitor Stand Pole
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), legMat);
  arm.position.set(0, 0.95, -0.35);
  deskGroup.add(arm);

  // Left Monitor (Angled slightly)
  const mon1Casing = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.42, 0.03), casingMat);
  mon1Casing.position.set(-0.38, 1.05, -0.32);
  mon1Casing.rotation.y = 0.15;
  const mon1Screen = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.38), monitorMat);
  mon1Screen.position.set(0, 0, 0.02);
  mon1Casing.add(mon1Screen);
  deskGroup.add(mon1Casing);

  // Right Monitor (Angled slightly inward)
  const mon2Casing = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.42, 0.03), casingMat);
  mon2Casing.position.set(0.38, 1.05, -0.32);
  mon2Casing.rotation.y = -0.15;
  const mon2Screen = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.38), monitorMat);
  mon2Screen.position.set(0, 0, 0.02);
  mon2Casing.add(mon2Screen);
  deskGroup.add(mon2Casing);

  // 5. Desk Accessories: Keyboard, Mousepad, Slim Laptop
  const padMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const mousepad = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.005, 0.4), padMat);
  mousepad.position.set(0, 0.785, 0.1);
  deskGroup.add(mousepad);

  // Mechanical Keyboard
  const kbMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.14), kbMat);
  keyboard.position.set(-0.08, 0.795, 0.1);
  deskGroup.add(keyboard);

  // Ergonomic Mouse
  const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.12), casingMat);
  mouse.position.set(0.24, 0.795, 0.1);
  deskGroup.add(mouse);

  // Compact Designer Mug
  const mugMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.1, 12), mugMat);
  mug.position.set(0.85, 0.83, 0.1);
  deskGroup.add(mug);

  // 6. Ergonomic Mesh Swivel Chair (5 wheels, piston, mesh seat & back)
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0, 0, 0.65);
  chairGroup.rotation.y = Math.PI;

  const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
  const meshSeatMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

  // 5-Star Wheel Base
  const baseCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 10), chromeMat);
  baseCenter.position.y = 0.08;
  chairGroup.add(baseCenter);

  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.04), chromeMat);
    leg.position.set(Math.cos(angle) * 0.16, 0.06, Math.sin(angle) * 0.16);
    leg.rotation.y = -angle;
    chairGroup.add(leg);

    // Wheel
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 8), casingMat);
    wheel.position.set(Math.cos(angle) * 0.3, 0.025, Math.sin(angle) * 0.3);
    chairGroup.add(wheel);
  }

  // Piston
  const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 10), chromeMat);
  piston.position.y = 0.26;
  chairGroup.add(piston);

  // Seat
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.07, 0.5), meshSeatMat);
  seat.position.y = 0.47;
  chairGroup.add(seat);

  // Mesh Backrest
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.58, 0.05), meshSeatMat);
  back.position.set(0, 0.78, 0.24);
  back.rotation.x = 0.08;
  chairGroup.add(back);

  // Armrests
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.24), legMat);
  armL.position.set(-0.28, 0.62, 0.05);
  chairGroup.add(armL);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.24), legMat);
  armR.position.set(0.28, 0.62, 0.05);
  chairGroup.add(armR);

  deskGroup.add(chairGroup);
  return deskGroup;
}

/**
 * Creates an Architectural Indoor Potted Plant (Ficus / Monstera style)
 */
function createIndoorPlant(x: number, z: number, scale: number = 1): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.scale.setScalar(scale);

  // Ceramic Planter Pot (Modern White Cylindrical)
  const potMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.1,
  });
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.7, 16), potMat);
  pot.position.y = 0.35;
  pot.castShadow = true;
  group.add(pot);

  // Soil
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x3f2e1e, roughness: 0.9 });
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.05, 16), soilMat);
  soil.position.y = 0.68;
  group.add(soil);

  // Stems and Large Ficus Leaves
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // Vibrant rich green
    roughness: 0.4,
    side: THREE.DoubleSide,
  });

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7 });

  for (let i = 0; i < 7; i++) {
    const angle = (i * Math.PI * 2) / 7 + Math.random() * 0.3;
    const height = 0.8 + Math.random() * 0.6;
    const reach = 0.25 + Math.random() * 0.2;

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, height, 6), stemMat);
    stem.position.set(Math.cos(angle) * reach * 0.4, 0.7 + height / 2, Math.sin(angle) * reach * 0.4);
    stem.rotation.z = Math.cos(angle) * 0.25;
    stem.rotation.x = Math.sin(angle) * 0.25;
    group.add(stem);

    // Large Lush Leaf at tip
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.01, 0.45), leafMat);
    leaf.position.set(Math.cos(angle) * reach * 1.1, 0.7 + height, Math.sin(angle) * reach * 1.1);
    leaf.rotation.y = angle;
    leaf.rotation.x = 0.5;
    group.add(leaf);
  }

  return group;
}

/**
 * Creates modern glass partition wall with sleek dark aluminum mullions
 */
function createGlassPartitionWall(
  x: number,
  z: number,
  length: number,
  rotY: number = 0,
  hasDoorway: boolean = false
): THREE.Group {
  const wallGroup = new THREE.Group();
  wallGroup.position.set(x, 0, z);
  wallGroup.rotation.y = rotY;

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe, // Subtle blue-tinted architectural glass
    transmission: 0.88,
    opacity: 0.35,
    transparent: true,
    roughness: 0.1,
    ior: 1.5,
    metalness: 0.1,
    thickness: 0.4,
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Dark charcoal aluminum
    roughness: 0.3,
    metalness: 0.8,
  });

  const wallH = 2.8;

  if (!hasDoorway) {
    // Solid glass panel
    const glass = new THREE.Mesh(new THREE.BoxGeometry(length, wallH, 0.04), glassMat);
    glass.position.y = wallH / 2;
    wallGroup.add(glass);

    // Top and bottom aluminum frame
    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.08), frameMat);
    topFrame.position.y = wallH;
    wallGroup.add(topFrame);

    const botFrame = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.08), frameMat);
    botFrame.position.y = 0.04;
    wallGroup.add(botFrame);

    // Vertical Mullions every 2 meters
    const steps = Math.floor(length / 2);
    for (let i = 0; i <= steps; i++) {
      const mx = -length / 2 + (i * length) / steps;
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.06, wallH, 0.07), frameMat);
      mullion.position.set(mx, wallH / 2, 0);
      wallGroup.add(mullion);
    }
  } else {
    // Glass wall with 1.2m open entrance doorway
    const segW = (length - 1.4) / 2;
    // Left segment
    const glassL = new THREE.Mesh(new THREE.BoxGeometry(segW, wallH, 0.04), glassMat);
    glassL.position.set(-length / 2 + segW / 2, wallH / 2, 0);
    wallGroup.add(glassL);

    // Right segment
    const glassR = new THREE.Mesh(new THREE.BoxGeometry(segW, wallH, 0.04), glassMat);
    glassR.position.set(length / 2 - segW / 2, wallH / 2, 0);
    wallGroup.add(glassR);

    // Lintel header over doorway
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(length, 0.1, 0.08), frameMat);
    lintel.position.y = wallH;
    wallGroup.add(lintel);

    // Doorway frame posts
    const postL = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, 0.08), frameMat);
    postL.position.set(-0.7, wallH / 2, 0);
    wallGroup.add(postL);

    const postR = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, 0.08), frameMat);
    postR.position.set(0.7, wallH / 2, 0);
    wallGroup.add(postR);
  }

  return wallGroup;
}

/**
 * Builds the Complete High-End Modern Glass Office Floor Building
 */
export function buildModernOfficeFloor(): OfficeBuildingComponents {
  const root = new THREE.Group();
  const animatedLEDs: THREE.Mesh[] = [];
  const screenMeshes: THREE.Mesh[] = [];
  const poleHitboxes = new Map<PoleId, THREE.Mesh>();

  // =========================================================================
  // 1. EXTERIOR BUILDING STRUCTURE & LOWER FLOORS (Realistic Corporate Tower)
  // =========================================================================
  const facadeTex = createBuildingFacadeTexture();
  const towerMat = new THREE.MeshStandardMaterial({
    map: facadeTex,
    roughness: 0.2,
    metalness: 0.8,
  });

  // Main lower building mass (levels below this active office floor)
  const lowerTower = new THREE.Mesh(new THREE.BoxGeometry(42, 16, 42), towerMat);
  lowerTower.position.y = -8.1;
  lowerTower.receiveShadow = true;
  root.add(lowerTower);

  // Exterior ground concrete plinth
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(60, 2, 60),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
  );
  plinth.position.y = -17;
  root.add(plinth);

  // =========================================================================
  // 2. FLOOR ZONING (Architectural Parquet, Carpet Tiles & Terrazzo)
  // =========================================================================
  const parquetTex = createWoodParquetTexture();
  const carpetTex = createOfficeCarpetTexture();
  const terrazzoTex = createPolishedTerrazzoTexture();

  // A. Central Agora, Corridors & Reception (Polished Terrazzo)
  const agoraFloor = new THREE.Mesh(
    new THREE.BoxGeometry(36, 0.2, 36),
    new THREE.MeshStandardMaterial({
      map: terrazzoTex,
      roughness: 0.25,
      metalness: 0.1,
    })
  );
  agoraFloor.position.y = -0.1;
  agoraFloor.receiveShadow = true;
  root.add(agoraFloor);

  // B. North-West: Pôle Tech (Engineering Lab) — Charcoal Technical Carpet Tiles
  const techFloor = new THREE.Mesh(
    new THREE.BoxGeometry(15, 0.22, 15),
    new THREE.MeshStandardMaterial({
      map: carpetTex,
      roughness: 0.8,
      metalness: 0.1,
    })
  );
  techFloor.position.set(-9, -0.08, -9);
  techFloor.receiveShadow = true;
  root.add(techFloor);

  // C. North-East: Maison Carole (Creative House) — Warm Oak Parquet
  const caroleFloor = new THREE.Mesh(
    new THREE.BoxGeometry(15, 0.22, 15),
    new THREE.MeshStandardMaterial({
      map: parquetTex,
      roughness: 0.4,
      metalness: 0.1,
    })
  );
  caroleFloor.position.set(9, -0.08, -9);
  caroleFloor.receiveShadow = true;
  root.add(caroleFloor);

  // D. South-West: Pôle Contenu (Media Studio / Boardroom) — Charcoal Acoustic Carpet
  const contenuFloor = new THREE.Mesh(
    new THREE.BoxGeometry(15, 0.22, 15),
    new THREE.MeshStandardMaterial({
      map: carpetTex,
      roughness: 0.8,
      metalness: 0.1,
    })
  );
  contenuFloor.position.set(-9, -0.08, 9);
  contenuFloor.receiveShadow = true;
  root.add(contenuFloor);

  // E. South-East: Pôle Personnel (Executive Command Suite) — Warm Oak Parquet
  const persoFloor = new THREE.Mesh(
    new THREE.BoxGeometry(15, 0.22, 15),
    new THREE.MeshStandardMaterial({
      map: parquetTex,
      roughness: 0.4,
      metalness: 0.1,
    })
  );
  persoFloor.position.set(9, -0.08, 9);
  persoFloor.receiveShadow = true;
  root.add(persoFloor);

  // =========================================================================
  // 3. ARCHITECTURAL PERIMETER CURTAIN WALLS & SKY BALCONIES
  // =========================================================================
  // Low exterior glass balustrades around the perimeter (Open-roof view like reference image)
  const balustradeMat = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    transmission: 0.9,
    opacity: 0.4,
    transparent: true,
    roughness: 0.1,
    metalness: 0.1,
  });
  const railFrameMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.8,
    roughness: 0.2,
  });

  // Perimeter Glass Railings (1.1m high with stainless steel top rail)
  const createBalustradeSection = (length: number, x: number, z: number, rotY: number) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(x, 0, z);
    bGroup.rotation.y = rotY;

    const glass = new THREE.Mesh(new THREE.BoxGeometry(length, 1.1, 0.04), balustradeMat);
    glass.position.y = 0.55;
    bGroup.add(glass);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.08), railFrameMat);
    rail.position.y = 1.1;
    bGroup.add(rail);

    return bGroup;
  };

  root.add(createBalustradeSection(36, 0, -18, 0)); // North edge
  root.add(createBalustradeSection(36, 0, 18, 0));  // South edge
  root.add(createBalustradeSection(36, -18, 0, Math.PI / 2)); // West edge
  root.add(createBalustradeSection(36, 18, 0, Math.PI / 2));  // East edge

  // Modern Architectural Concrete Structural Columns (Smooth cylindrical)
  const colMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
  const colGeom = new THREE.CylinderGeometry(0.4, 0.4, 3.2, 16);

  const colPositions = [
    [-9, -9], [9, -9], [-9, 9], [9, 9],
    [-9, 0], [9, 0], [0, -9], [0, 9]
  ];
  colPositions.forEach(([cx, cz]) => {
    const col = new THREE.Mesh(colGeom, colMat);
    col.position.set(cx, 1.6, cz);
    col.castShadow = true;
    root.add(col);
  });

  // =========================================================================
  // 4. GLASS PARTITIONS & INTERIOR ROOM WALLS (Coupe architecturale)
  // =========================================================================
  // A. Tech Lab Boundaries
  root.add(createGlassPartitionWall(-9, -1.8, 14, 0, true)); // South wall of Tech Lab with door
  root.add(createGlassPartitionWall(-1.8, -9, 14, Math.PI / 2, true)); // East wall of Tech Lab with door

  // B. Maison Carole Boundaries
  root.add(createGlassPartitionWall(9, -1.8, 14, 0, true)); // South wall of Carole
  root.add(createGlassPartitionWall(1.8, -9, 14, Math.PI / 2, true)); // West wall of Carole

  // C. Pôle Contenu Boundaries (Conference / Media Suite)
  root.add(createGlassPartitionWall(-9, 1.8, 14, 0, true)); // North wall of Contenu
  root.add(createGlassPartitionWall(-1.8, 9, 14, Math.PI / 2, true)); // East wall of Contenu

  // D. Pôle Personnel Boundaries (Executive Suite)
  root.add(createGlassPartitionWall(9, 1.8, 14, 0, true)); // North wall of Personnel
  root.add(createGlassPartitionWall(1.8, 9, 14, Math.PI / 2, true)); // West wall of Personnel

  // =========================================================================
  // 5. ZONE FURNISHINGS & DETAILS
  // =========================================================================

  // --- SECTOR 1: PÔLE TECH (Engineering Lab & Server Bay) ---
  // Workstation cluster 1 (Dev IA)
  root.add(createWorkstationDesk(-10.2, -9.5, 0.4, '#00f0ff', 'tech'));
  // Workstation cluster 2 (Veille Technique)
  root.add(createWorkstationDesk(-7.8, -8.2, -0.6, '#00f0ff', 'tech'));

  // Server Rack Cabinets (With blinking LED activity banks)
  const serverMat = new THREE.MeshStandardMaterial({
    map: createServerRackTexture(),
    metalness: 0.8,
    roughness: 0.3,
  });

  for (let i = 0; i < 3; i++) {
    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.9), serverMat);
    rack.position.set(-14.5, 1.2, -13 + i * 1.6);
    rack.castShadow = true;
    root.add(rack);

    // Blinking activity light strips
    const ledStrip = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 2.0, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    ledStrip.position.set(-13.9, 1.2, -13 + i * 1.6);
    root.add(ledStrip);
    animatedLEDs.push(ledStrip);
  }

  // Large Whiteboard / Architectural Diagram Board
  const wbBoard = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 1.6, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  wbBoard.position.set(-10, 1.5, -16.2);
  root.add(wbBoard);

  // --- SECTOR 2: MAISON CAROLE (Haute Création & Design Studio) ---
  // Styliste Desk
  root.add(createWorkstationDesk(7.8, -9.5, -0.4, '#fb7185', 'carole'));
  // Tendances Desk
  root.add(createWorkstationDesk(10.2, -8.0, 1.8, '#fb7185', 'carole'));

  // Large Creative Drafting & Moodboard Table
  const draftTable = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.1, 1.8),
    new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 }) // Natural wood
  );
  draftTable.position.set(13.5, 0.85, -12);
  draftTable.castShadow = true;
  root.add(draftTable);

  const draftLegs = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
  );
  [[-1.5, -0.7], [1.5, -0.7], [-1.5, 0.7], [1.5, 0.7]].forEach(([lx, lz]) => {
    const l = draftLegs.clone();
    l.position.set(13.5 + lx, 0.4, -12 + lz);
    root.add(l);
  });

  // Fabric Rolls / Swatches on table
  const fabricColors = [0xf43f5e, 0xec4899, 0xfacc15, 0x14b8a6, 0x6366f1];
  fabricColors.forEach((color, idx) => {
    const roll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
    );
    roll.position.set(12.5 + idx * 0.4, 0.98, -12);
    roll.rotation.z = Math.PI / 2;
    root.add(roll);
  });

  // Designer Mannequin Stand
  const mannequinGroup = new THREE.Group();
  mannequinGroup.position.set(15, 0, -8);
  const mStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
  );
  mStand.position.y = 0.7;
  mannequinGroup.add(mStand);
  const mTorso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.14, 0.7, 12),
    new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.6 })
  );
  mTorso.position.y = 1.15;
  mannequinGroup.add(mTorso);
  root.add(mannequinGroup);

  // --- SECTOR 3: PÔLE CONTENU (Media Suite & Glass Conference Room) ---
  // Script Desk
  root.add(createWorkstationDesk(-10.2, 8.5, 0.8, '#c084fc', 'contenu'));
  // Montage Desk
  root.add(createWorkstationDesk(-7.8, 9.8, -1.2, '#c084fc', 'contenu'));

  // Conference Boardroom Table (Long modern executive boat-shaped table)
  const confTableMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Deep slate marble
    roughness: 0.2,
    metalness: 0.3,
  });
  const confTable = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.1, 1.6), confTableMat);
  confTable.position.set(-12, 0.76, 13.5);
  confTable.castShadow = true;
  root.add(confTable);

  // 6 Conference Chairs around table
  const confChairMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
  for (let c = 0; c < 3; c++) {
    // North side chairs
    const chairN = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), confChairMat);
    chairN.position.set(-13.4 + c * 1.4, 0.4, 12.2);
    root.add(chairN);

    // South side chairs
    const chairS = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), confChairMat);
    chairS.position.set(-13.4 + c * 1.4, 0.4, 14.8);
    root.add(chairS);
  }

  // Wall-mounted Presentation Screen
  const screenMat = new THREE.MeshBasicMaterial({
    map: createHoloScreenTexture('contenu'),
  });
  const presScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.6), screenMat);
  presScreen.position.set(-12, 1.8, 16.85);
  presScreen.rotation.y = Math.PI;
  root.add(presScreen);
  screenMeshes.push(presScreen);

  // Studio Softbox lights on tripods
  const softboxMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const softbox = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.1), softboxMat);
  softbox.position.set(-6, 2.0, 14.5);
  softbox.rotation.y = -0.5;
  root.add(softbox);

  // --- SECTOR 4: PÔLE PERSONNEL (Executive Command Suite) ---
  // Assistant Desk
  root.add(createWorkstationDesk(8.0, 8.2, 0.3, '#34d399', 'personnel'));
  // Organisateur Desk
  root.add(createWorkstationDesk(10.5, 9.8, -0.5, '#34d399', 'personnel'));

  // Executive Corner Desk with Glass Top
  const execDesk = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.1, 1.4),
    new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.1,
      metalness: 0.4,
    })
  );
  execDesk.position.set(13.5, 0.78, 13.5);
  execDesk.castShadow = true;
  root.add(execDesk);

  // High-backed Leather Executive Chair
  const execChair = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 1.2, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 })
  );
  execChair.position.set(13.5, 0.6, 14.6);
  root.add(execChair);

  // Holographic Command Radar Display
  const radarScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.4),
    new THREE.MeshBasicMaterial({ map: createHoloScreenTexture('personnel') })
  );
  radarScreen.position.set(13.5, 1.8, 16.85);
  radarScreen.rotation.y = Math.PI;
  root.add(radarScreen);
  screenMeshes.push(radarScreen);

  // =========================================================================
  // 6. CENTRAL AGORA, CAFÉ LOUNGE & BIOPHILIC INDOOR GREENERY
  // =========================================================================
  // Barista Espresso Counter / Kitchenette
  const counterMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3 });
  const barCounter = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.05, 1.2), counterMat);
  barCounter.position.set(0, 0.525, -2.8);
  barCounter.castShadow = true;
  root.add(barCounter);

  // Espresso Machine
  const espressoMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.9, roughness: 0.2 });
  const espressoMachine = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.5), espressoMat);
  espressoMachine.position.set(0.6, 1.25, -2.8);
  root.add(espressoMachine);

  // Comfortable Sectional Lounge Sofa (L-shaped in Petrol Blue)
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const sofaBase1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.45, 1.0), sofaMat);
  sofaBase1.position.set(-0.8, 0.225, 2.5);
  sofaBase1.castShadow = true;
  root.add(sofaBase1);

  const sofaBase2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.45, 2.4), sofaMat);
  sofaBase2.position.set(1.5, 0.225, 1.8);
  sofaBase2.castShadow = true;
  root.add(sofaBase2);

  // Sofa Backrests
  const sofaBack1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.4, 0.2), sofaMat);
  sofaBack1.position.set(-0.8, 0.55, 3.0);
  root.add(sofaBack1);

  const sofaBack2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 2.4), sofaMat);
  sofaBack2.position.set(2.0, 0.55, 1.8);
  root.add(sofaBack2);

  // Low Wooden Coffee Table
  const coffeeTable = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.35, 1.0),
    new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4 })
  );
  coffeeTable.position.set(-0.4, 0.175, 1.4);
  coffeeTable.castShadow = true;
  root.add(coffeeTable);

  // Architectural Potted Indoor Plants (Ficus & Monstera in pristine white pots)
  root.add(createIndoorPlant(-2.4, -2.8, 1.1));
  root.add(createIndoorPlant(2.4, -2.8, 1.1));
  root.add(createIndoorPlant(-2.8, 2.8, 1.3));
  root.add(createIndoorPlant(2.8, 3.2, 1.2));
  root.add(createIndoorPlant(-15.5, -7.5, 1.4));
  root.add(createIndoorPlant(15.5, -7.5, 1.4));
  root.add(createIndoorPlant(-15.5, 7.5, 1.4));
  root.add(createIndoorPlant(15.5, 7.5, 1.4));

  // =========================================================================
  // 7. INVISIBLE CLICK HITBOXES FOR THE 4 DEPARTMENTS
  // =========================================================================
  const createPoleHitbox = (id: PoleId, x: number, z: number) => {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(14, 3, 14),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    box.position.set(x, 1.5, z);
    root.add(box);
    poleHitboxes.set(id, box);
  };

  createPoleHitbox('tech', -9, -9);
  createPoleHitbox('carole', 9, -9);
  createPoleHitbox('contenu', -9, 9);
  createPoleHitbox('personnel', 9, 9);

  return {
    group: root,
    animatedLEDs,
    screenMeshes,
    poleHitboxes,
  };
}
