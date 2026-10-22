import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Gamepad2,
  GripHorizontal,
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronUp,
} from 'lucide-react';
import { AGENT_STATES_CONFIG, type AgentState } from '../types/world.ts';

interface FloatingWorkspaceHubProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
  avatarColor?: string;
  avatarInitials?: string;
  status?: AgentState;
  onEnterFPS?: () => void;
  children: React.ReactNode;
}

export const FloatingWorkspaceHub: React.FC<FloatingWorkspaceHubProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeText,
  badgeColor = '#00f0ff',
  avatarColor = '#0284c7',
  avatarInitials = 'IA',
  status = 'working',
  onEnterFPS,
  children,
}) => {
  // Window geometry state
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      const w = Math.min(480, window.innerWidth - 24);
      return {
        x: Math.max(12, window.innerWidth - w - 24),
        y: 76,
      };
    }
    return { x: 800, y: 76 };
  });

  const [size, setSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window !== 'undefined') {
      return {
        width: Math.min(480, window.innerWidth - 24),
        height: Math.min(720, window.innerHeight - 120),
      };
    }
    return { width: 480, height: 680 };
  });

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const prevGeoRef = useRef<{ pos: { x: number; y: number }; size: { width: number; height: number } }>({
    pos: position,
    size,
  });

  // Dragging & Resizing tracking refs
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  const isResizingRef = useRef<'corner' | 'right' | 'bottom' | null>(null);
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({
    mouseX: 0,
    mouseY: 0,
    startW: 0,
    startH: 0,
  });

  // Clamp position to viewport bounds
  const clampPosition = useCallback((x: number, y: number, w: number, h: number) => {
    const maxX = Math.max(0, window.innerWidth - w - 8);
    const maxY = Math.max(0, window.innerHeight - h - 8);
    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(64, y), maxY),
    };
  }, []);

  // Window resize handler
  useEffect(() => {
    const handleWindowResize = () => {
      if (isMaximized) {
        setSize({
          width: Math.min(580, window.innerWidth - 24),
          height: window.innerHeight - 90,
        });
        setPosition({
          x: Math.max(12, window.innerWidth - Math.min(580, window.innerWidth - 24) - 16),
          y: 72,
        });
      } else {
        setPosition((prev) => clampPosition(prev.x, prev.y, size.width, size.height));
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isMaximized, size, clampPosition]);

  // Pointer drag movement
  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current && !isMaximized) {
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      const newPos = clampPosition(
        dragStartRef.current.startX + dx,
        dragStartRef.current.startY + dy,
        size.width,
        size.height
      );
      setPosition(newPos);
    } else if (isResizingRef.current && !isMaximized) {
      const dx = e.clientX - resizeStartRef.current.mouseX;
      const dy = e.clientY - resizeStartRef.current.mouseY;
      const mode = isResizingRef.current;

      setSize((prev) => {
        let newW = prev.width;
        let newH = prev.height;

        if (mode === 'corner' || mode === 'right') {
          newW = Math.max(340, Math.min(window.innerWidth - position.x - 12, resizeStartRef.current.startW + dx));
        }
        if (mode === 'corner' || mode === 'bottom') {
          newH = Math.max(360, Math.min(window.innerHeight - position.y - 12, resizeStartRef.current.startH + dy));
        }

        return { width: newW, height: newH };
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
    if (isResizingRef.current) {
      isResizingRef.current = null;
    }
  };

  // Corner / edge resizing triggers
  const handleResizePointerDown = (e: React.PointerEvent, mode: 'corner' | 'right' | 'bottom') => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isResizingRef.current = mode;
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: size.width,
      startH: size.height,
    };
  };

  // Snap window to left or right flank
  const handleSnapLeft = () => {
    setIsMaximized(false);
    setPosition({ x: 16, y: 76 });
  };

  const handleSnapRight = () => {
    setIsMaximized(false);
    setPosition({
      x: Math.max(16, window.innerWidth - size.width - 16),
      y: 76,
    });
  };

  // Toggle maximize
  const handleToggleMaximize = () => {
    if (!isMaximized) {
      prevGeoRef.current = { pos: position, size };
      const maxW = Math.min(620, window.innerWidth - 32);
      const maxH = window.innerHeight - 90;
      setSize({ width: maxW, height: maxH });
      setPosition({
        x: Math.max(16, window.innerWidth - maxW - 16),
        y: 72,
      });
      setIsMaximized(true);
    } else {
      setPosition(prevGeoRef.current.pos);
      setSize(prevGeoRef.current.size);
      setIsMaximized(false);
    }
  };

  if (!isOpen) return null;

  const stateCfg = AGENT_STATES_CONFIG[status] || AGENT_STATES_CONFIG.working;

  // Render Minimized Tray Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-6 z-40 pointer-events-auto">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/95 border border-cyan-500/40 text-white shadow-2xl shadow-cyan-950/50 hover:border-cyan-400 hover:scale-105 transition-all group font-mono text-xs"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm"
            style={{ backgroundColor: avatarColor }}
          >
            {avatarInitials}
          </div>
          <div className="text-left">
            <span className="block font-bold text-slate-100">{title}</span>
            <span className="text-[10px] text-cyan-400">{stateCfg.label}</span>
          </div>
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 ml-1 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        role="dialog"
        aria-label={`Hub spatial - ${title}`}
        className="pointer-events-auto absolute flex flex-col bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/40 text-white font-sans overflow-hidden transition-shadow"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        {/* Holographic Corner Tech Accents */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

        {/* Window Title Bar & Action Controls (Draggable) */}
        <div
          onPointerDown={handleHeaderPointerDown}
          className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800/80 cursor-grab active:cursor-grabbing shrink-0 select-none"
        >
          {/* Left: Grip + Avatar + Title Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <GripHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-white shrink-0 border border-white/20"
              style={{ backgroundColor: avatarColor }}
            >
              {avatarInitials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold font-mono text-slate-100 truncate">{title}</h3>
                {badgeText && (
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0"
                    style={{
                      borderColor: `${badgeColor}50`,
                      color: badgeColor,
                      backgroundColor: `${badgeColor}15`,
                    }}
                  >
                    {badgeText}
                  </span>
                )}
              </div>
              {subtitle && <p className="text-[10px] text-slate-400 truncate">{subtitle}</p>}
            </div>
          </div>

          {/* Right: Window Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* FPS Mode Button */}
            {onEnterFPS && (
              <button
                onClick={onEnterFPS}
                aria-label="Incarner l'agent en mode FPS"
                title="Passer en vue subjective (Mode FPS - WASD / Souris)"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 text-[10px] font-mono font-bold transition-all shadow-sm"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MODE FPS</span>
              </button>
            )}

            {/* Snap Left */}
            <button
              onClick={handleSnapLeft}
              aria-label="Ancrer à gauche"
              title="Ancrer le panneau à gauche"
              className="p-1 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-800 transition-colors hidden sm:block"
            >
              <ArrowLeftToLine className="w-3.5 h-3.5" />
            </button>

            {/* Snap Right */}
            <button
              onClick={handleSnapRight}
              aria-label="Ancrer à droite"
              title="Ancrer le panneau à droite"
              className="p-1 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-800 transition-colors hidden sm:block"
            >
              <ArrowRightToLine className="w-3.5 h-3.5" />
            </button>

            {/* Minimize */}
            <button
              onClick={() => setIsMinimized(true)}
              aria-label="Réduire la fenêtre"
              title="Réduire en docklet compact"
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Maximize / Restore */}
            <button
              onClick={handleToggleMaximize}
              aria-label={isMaximized ? 'Restaurer la taille' : 'Agrandir la fenêtre'}
              title={isMaximized ? 'Restaurer la taille' : 'Agrandir en panneau latéral'}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              title="Fermer l'inspecteur"
              className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Window Body */}
        <div className="flex-1 overflow-y-auto p-4 font-sans space-y-4">{children}</div>

        {/* Resizing Edge & Corner Handles */}
        {!isMaximized && (
          <>
            {/* Right edge resize */}
            <div
              onPointerDown={(e) => handleResizePointerDown(e, 'right')}
              className="absolute top-10 right-0 w-2 h-[calc(100%-20px)] cursor-ew-resize hover:bg-cyan-500/20 transition-colors"
            />
            {/* Bottom edge resize */}
            <div
              onPointerDown={(e) => handleResizePointerDown(e, 'bottom')}
              className="absolute bottom-0 left-0 h-2 w-[calc(100%-20px)] cursor-ns-resize hover:bg-cyan-500/20 transition-colors"
            />
            {/* Bottom-right corner resize */}
            <div
              onPointerDown={(e) => handleResizePointerDown(e, 'corner')}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-end justify-end p-0.5 group"
            >
              <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-cyan-500/60 group-hover:border-cyan-300 transition-colors" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
