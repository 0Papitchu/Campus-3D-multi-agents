import * as THREE from 'three';
import { AgentState, AGENT_STATES_CONFIG } from '../types/world.ts';

/**
 * Procedural cybernetic textures generated dynamically in memory via 2D Canvas.
 * SRGBColorSpace, repeat wrapping, zero 404s.
 */

export function createCyberGridTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian/graphite dark base
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, size, size);

  // Micro grid lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)'; // Subtle sky blue grid
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, x);
    ctx.lineTo(size, x);
    ctx.stroke();
  }

  // Major circuit conduits
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= size; x += step * 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, x);
    ctx.lineTo(size, x);
    ctx.stroke();
  }

  // Circuit nexus dots
  ctx.fillStyle = '#00f0ff';
  for (let x = 0; x <= size; x += step * 4) {
    for (let y = 0; y <= size; y += step * 4) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

export function createHexPlatformTexture(accentColor: string = '#00f0ff'): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark metallic graphite panel
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size, size);

  // Border bevel
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, size - 8, size - 8);

  // Corner tech notches
  ctx.fillStyle = accentColor;
  const cornerSize = 18;
  // top-left
  ctx.fillRect(4, 4, cornerSize, 4);
  ctx.fillRect(4, 4, 4, cornerSize);
  // top-right
  ctx.fillRect(size - 4 - cornerSize, 4, cornerSize, 4);
  ctx.fillRect(size - 8, 4, 4, cornerSize);
  // bottom-left
  ctx.fillRect(4, size - 8, cornerSize, 4);
  ctx.fillRect(4, size - 4 - cornerSize, 4, cornerSize);
  // bottom-right
  ctx.fillRect(size - 4 - cornerSize, size - 8, cornerSize, 4);
  ctx.fillRect(size - 8, size - 4 - cornerSize, 4, cornerSize);

  // Subtle interior grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  for (let i = 24; i < size; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 8);
    ctx.lineTo(i, size - 8);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Architectural Warm Scandinavian Wood Parquet Flooring
 */
export function createWoodParquetTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm natural honey/oak base
  ctx.fillStyle = '#b3824f';
  ctx.fillRect(0, 0, size, size);

  // Planks
  const plankH = 32;
  const plankW = 128;
  const colors = ['#b88753', '#af7e4b', '#c2925d', '#a67543', '#bc8c58'];

  for (let y = 0; y < size; y += plankH) {
    const rowOffset = (y / plankH) % 2 === 0 ? 0 : plankW / 2;
    for (let x = -plankW; x < size + plankW; x += plankW) {
      const px = x + rowOffset;
      const c = colors[Math.abs(Math.floor(px * 13 + y * 7)) % colors.length];
      ctx.fillStyle = c;
      ctx.fillRect(px, y, plankW - 1, plankH - 1);

      // Subtle wood grain lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let g = 4; g < plankH - 4; g += 6) {
        ctx.beginPath();
        ctx.moveTo(px, y + g);
        ctx.lineTo(px + plankW, y + g + (Math.sin(px + g) * 2));
        ctx.stroke();
      }

      // Plank bevel seam
      ctx.strokeStyle = 'rgba(60, 38, 16, 0.3)';
      ctx.strokeRect(px, y, plankW, plankH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * Modern Corporate Charcoal / Slate Woven Office Carpet Tile Texture
 */
export function createOfficeCarpetTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e293b'; // Slate 800 base
  ctx.fillRect(0, 0, size, size);

  // Subtle crosshatch woven acoustic weave
  ctx.fillStyle = '#0f172a';
  for (let x = 0; x < size; x += 4) {
    for (let y = 0; y < size; y += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  // Carpet tile seams (64px grid)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= size; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

/**
 * Polished Architectural Concrete / Terrazzo Flooring for Atrium & Corridors
 */
export function createPolishedTerrazzoTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Smooth cool grey terrazzo base
  ctx.fillStyle = '#cbd5e1'; // Slate 300
  ctx.fillRect(0, 0, size, size);

  // Fine mineral speckles
  const speckleColors = ['#94a3b8', '#64748b', '#e2e8f0', '#475569', '#f8fafc'];
  for (let i = 0; i < 2500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2 + 0.5;
    ctx.fillStyle = speckleColors[Math.floor(Math.random() * speckleColors.length)];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Large polished expansion joints (every 128px)
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i <= size; i += 128) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/**
 * Modern Glass Office Building Curtain Wall Facade Texture
 */
export function createBuildingFacadeTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark tinted architectural glass base
  ctx.fillStyle = '#0a1120';
  ctx.fillRect(0, 0, size, size);

  // Glass reflections gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)'); // Sky blue sky reflection
  grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.1)');
  grad.addColorStop(1, 'rgba(14, 165, 233, 0.3)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Heavy aluminum mullions / transom window grids
  const windowW = 64;
  const windowH = 96;

  ctx.strokeStyle = '#334155'; // Dark aluminum frame
  ctx.lineWidth = 4;
  for (let x = 0; x <= size; x += windowW) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += windowH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Thin interior blinds / louvers
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let y = 0; y < size; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}

/**
 * Server Rack Face Texture with blinking LED indicator banks
 */
export function createServerRackTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Deep black brushed metal rack chassis
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, size, size);

  // 1U to 4U rack slots
  const slotH = 28;
  for (let y = 8; y < size - 8; y += slotH) {
    // Faceplate
    ctx.fillStyle = '#111827';
    ctx.fillRect(8, y, size - 16, slotH - 4);

    // Bevel
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, y, size - 16, slotH - 4);

    // Ventilation slots
    ctx.fillStyle = '#030712';
    for (let vx = 20; vx < 120; vx += 6) {
      ctx.fillRect(vx, y + 6, 3, slotH - 16);
    }

    // Status LEDs
    const ledColors = ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b'];
    for (let lx = 140; lx < size - 24; lx += 14) {
      ctx.fillStyle = ledColors[Math.floor(Math.random() * ledColors.length)];
      ctx.beginPath();
      ctx.arc(lx, y + slotH / 2 - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}


export function createHoloScreenTexture(theme: 'tech' | 'carole' | 'contenu' | 'personnel'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // Dark transparent cyber interface
  ctx.fillStyle = '#060a12';
  ctx.fillRect(0, 0, 512, 320);

  // Header Bar
  ctx.fillStyle = '#0f1b2d';
  ctx.fillRect(0, 0, 512, 36);

  const colors = {
    tech: '#00f0ff',
    carole: '#f43f5e',
    contenu: '#c084fc',
    personnel: '#10b981',
  };
  const accent = colors[theme];

  // Header Title
  ctx.fillStyle = accent;
  ctx.font = 'bold 15px monospace';
  ctx.fillText(`// TELEMETRY_STREAM: ${theme.toUpperCase()}_SYS // LIVE_FEED`, 16, 24);

  // Scanlines effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let y = 36; y < 320; y += 4) {
    ctx.fillRect(0, y, 512, 2);
  }

  if (theme === 'tech') {
    // Code lines & memory blocks
    const codeLines = [
      'const neuralMatrix = await Kernel.allocateQuantumNodes(1024);',
      'inferencePipeline.pipe(agentCluster.stream()).to(ShaderBus);',
      '[OK] WASM Kernel: 0.84ms latency | 99.8% memory fidelity',
      'const targetFPS = 60.0; frameBudget = 16.66ms - measured: 14.1ms;',
      'dispatchMission({ id: "PRJ-TECH-01", target: "Dev IA" });',
    ];
    ctx.font = '13px monospace';
    codeLines.forEach((line, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#38bdf8' : '#818cf8';
      ctx.fillText(line, 20, 70 + idx * 26);
    });

    // Waveform graph at bottom
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 260);
    for (let x = 20; x < 490; x += 15) {
      const y = 260 + Math.sin(x * 0.08) * 25 + Math.cos(x * 0.04) * 12;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else if (theme === 'carole') {
    // Luxury Fashion & Moodboard
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.fillText('COLLECTION PRINTEMPS 2027 // ÉTUDE CHROMATIQUE', 20, 68);

    // Color swatches with hex
    const swatches = [
      { col: '#f43f5e', label: '#F43F5E TERRACOTTA VIF' },
      { col: '#fb7185', label: '#FB7185 ROSE POUDRE' },
      { col: '#fef08a', label: '#FEF08A LIN DORE' },
      { col: '#2dd4bf', label: '#2DD4BF NACRE AZUR' },
    ];
    swatches.forEach((s, i) => {
      ctx.fillStyle = s.col;
      ctx.fillRect(20 + i * 120, 95, 100, 60);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9px monospace';
      ctx.fillText(s.label, 20 + i * 120, 172);
    });

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px sans-serif';
    ctx.fillText('Simulation drapé 3D : Lin biologique 320g & Soie nacre', 20, 220);
    ctx.fillText('Statut : Prêt pour validation exécutive dans Command Center', 20, 245);
  } else if (theme === 'contenu') {
    // Audio / Video Timeline Waveforms
    ctx.fillStyle = '#c084fc';
    ctx.font = '13px monospace';
    ctx.fillText('TIMELINE 00:00:45:00 // 4K 60FPS SHORT VERTICAL', 20, 70);

    // Timeline tracks
    for (let t = 0; t < 3; t++) {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(20, 95 + t * 40, 470, 30);
      ctx.fillStyle = t === 0 ? '#a855f7' : t === 1 ? '#06b6d4' : '#10b981';
      ctx.fillRect(30 + t * 45, 98 + t * 40, 280 - t * 40, 24);
    }

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px monospace';
    ctx.fillText('Audio Master: -14.2 LUFS | Vocals: ElevenLabs Pro Clear', 20, 245);
  } else {
    // Command Center / NASA Dashboard
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('// CENTRAL NEXUS // FLIGHT STATUS: 8 AGENTS ONLINE', 20, 70);

    // KPI meters
    const kpis = [
      { label: 'NEURAL LATENCY', val: '14.2 ms' },
      { label: 'CPU CLUSTER', val: '58.4 %' },
      { label: 'PIPELINE FLOWS', val: '5 ACTIVE' },
      { label: 'HITL ARBITRAGE', val: '1 PENDING' },
    ];
    kpis.forEach((kpi, i) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20 + (i % 2) * 240, 95 + Math.floor(i / 2) * 65, 220, 52);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(kpi.label, 30 + (i % 2) * 240, 115 + Math.floor(i / 2) * 65);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(kpi.val, 30 + (i % 2) * 240, 137 + Math.floor(i / 2) * 65);
    });

    ctx.fillStyle = '#f87171';
    ctx.font = '12px monospace';
    ctx.fillText('! WARNING: Node-3 GPU conflict awaiting Human-in-the-Loop', 20, 255);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates 3D billboard status badge textures for all 7 agent states
 */
export function createStatusIconTexture(state: AgentState): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cfg = AGENT_STATES_CONFIG[state] || AGENT_STATES_CONFIG.idle;

  // Outer glowing ring
  ctx.beginPath();
  ctx.arc(64, 64, 52, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = cfg.color;
  ctx.shadowBlur = 16;
  ctx.fill();

  // Vibrant center circle
  ctx.beginPath();
  ctx.arc(64, 64, 46, 0, Math.PI * 2);
  ctx.fillStyle = cfg.color;
  ctx.shadowBlur = 0;
  ctx.fill();

  // White icon symbol
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (state === 'working') {
    // Play arrow / Pulse
    ctx.beginPath();
    ctx.moveTo(56, 46);
    ctx.lineTo(82, 64);
    ctx.lineTo(56, 82);
    ctx.closePath();
    ctx.fill();
  } else if (state === 'thinking') {
    // Quantum Atom / Concentric Rings
    ctx.beginPath();
    ctx.arc(64, 64, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(64, 64, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (state === 'waiting') {
    // Pause / Clock bars
    ctx.fillRect(52, 46, 8, 36);
    ctx.fillRect(68, 46, 8, 36);
  } else if (state === 'review') {
    // Question / Attention diamond
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 64, 65);
  } else if (state === 'done') {
    // Checkmark
    ctx.beginPath();
    ctx.moveTo(46, 64);
    ctx.lineTo(58, 76);
    ctx.lineTo(84, 50);
    ctx.stroke();
  } else if (state === 'error') {
    // Exclamation mark
    ctx.font = 'bold 52px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', 64, 64);
  } else if (state === 'offline') {
    // Standby Slash
    ctx.beginPath();
    ctx.moveTo(48, 48);
    ctx.lineTo(80, 80);
    ctx.stroke();
  } else {
    // IDLE: Dot
    ctx.beginPath();
    ctx.arc(64, 64, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
