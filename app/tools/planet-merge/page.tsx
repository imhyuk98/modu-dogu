"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

// ── Planet definitions ──────────────────────────────────────────────────────

interface PlanetDef {
  name: string;
  radius: number;
  color1: string;
  color2: string;
  points: number;
  ring?: boolean;
  glow?: boolean;
}

const PLANETS: PlanetDef[] = [
  { name: "수성", radius: 14, color1: "#b0b0b0", color2: "#808080", points: 1 },
  { name: "금성", radius: 20, color1: "#f5d06e", color2: "#d4942a", points: 3 },
  { name: "지구", radius: 26, color1: "#5ba3e6", color2: "#2d7d3a", points: 6 },
  { name: "화성", radius: 30, color1: "#e05533", color2: "#993322", points: 10 },
  { name: "목성", radius: 38, color1: "#e8a54b", color2: "#c4753a", points: 15 },
  { name: "토성", radius: 44, color1: "#e8cc6e", color2: "#c4a03a", points: 21, ring: true },
  { name: "천왕성", radius: 50, color1: "#5ec4c4", color2: "#2a8a8a", points: 28 },
  { name: "해왕성", radius: 56, color1: "#3355cc", color2: "#1a2a80", points: 36 },
  { name: "태양", radius: 64, color1: "#ffcc00", color2: "#ff8800", points: 50, glow: true },
];

const DROP_PLANET_MAX = 3; // Mercury, Venus, Earth, Mars (indices 0-3)

// ── Physics body ────────────────────────────────────────────────────────────

interface Body {
  id: number;
  type: number; // index into PLANETS
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  settled: boolean;
}

// ── Game constants ──────────────────────────────────────────────────────────

const CANVAS_W = 360;
const CANVAS_H = 560;
const WALL_LEFT = 10;
const WALL_RIGHT = CANVAS_W - 10;
const WALL_BOTTOM = CANVAS_H - 10;
const DANGER_Y = 80;
const GRAVITY = 0.35;
const DAMPING = 0.985;
const FRICTION = 0.4;
const RESTITUTION = 0.3;
const GAME_OVER_GRACE_FRAMES = 90; // ~1.5 sec grace period

// ── Main component ──────────────────────────────────────────────────────────

export default function PlanetMerge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef({
    bodies: [] as Body[],
    nextId: 1,
    score: 0,
    bestScore: 0,
    gameOver: false,
    dropX: CANVAS_W / 2,
    currentPlanet: 0,
    nextPlanet: 0,
    canDrop: true,
    dropCooldown: 0,
    dangerFrames: 0,
    mergeEffects: [] as { x: number; y: number; radius: number; frame: number }[],
  });

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentPlanet, setCurrentPlanet] = useState(0);
  const [nextPlanet, setNextPlanet] = useState(0);
  const animRef = useRef<number>(0);

  // Random planet for drop
  const randomDropPlanet = useCallback(() => {
    return Math.floor(Math.random() * (DROP_PLANET_MAX + 1));
  }, []);

  // Initialize
  useEffect(() => {
    const stored = localStorage.getItem("bestPlanetMerge");
    if (stored) {
      const val = parseInt(stored, 10);
      gameStateRef.current.bestScore = val;
      setBestScore(val);
    }
    const c = randomDropPlanet();
    const n = randomDropPlanet();
    gameStateRef.current.currentPlanet = c;
    gameStateRef.current.nextPlanet = n;
    setCurrentPlanet(c);
    setNextPlanet(n);
  }, [randomDropPlanet]);

  // Draw a planet on canvas with unique textures
  const drawPlanet = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, def: PlanetDef, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    const r = def.radius;

    // Clip to circle for textures
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.save();
    ctx.clip();

    // Base gradient
    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    grad.addColorStop(0, def.color1);
    grad.addColorStop(1, def.color2);
    ctx.fillStyle = grad;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);

    // Per-planet texture
    if (def.name === "수성") {
      // Craters
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      const craters = [[0.3, -0.2, 0.18], [-0.2, 0.3, 0.15], [0.1, 0.1, 0.12], [-0.35, -0.15, 0.1], [0.25, 0.35, 0.08]];
      for (const [cx, cy, cr] of craters) {
        ctx.beginPath();
        ctx.arc(x + cx * r, y + cy * r, cr * r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      for (const [cx, cy, cr] of craters) {
        ctx.beginPath();
        ctx.arc(x + cx * r - cr * r * 0.2, y + cy * r - cr * r * 0.2, cr * r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (def.name === "금성") {
      // Swirling clouds
      ctx.strokeStyle = "rgba(255,220,150,0.25)";
      ctx.lineWidth = r * 0.12;
      for (let i = 0; i < 5; i++) {
        const sy = y - r * 0.6 + i * r * 0.3;
        ctx.beginPath();
        ctx.moveTo(x - r, sy);
        ctx.quadraticCurveTo(x - r * 0.3, sy + r * 0.15 * (i % 2 === 0 ? 1 : -1), x, sy);
        ctx.quadraticCurveTo(x + r * 0.3, sy - r * 0.15 * (i % 2 === 0 ? 1 : -1), x + r, sy);
        ctx.stroke();
      }
      // Haze overlay
      const haze = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
      haze.addColorStop(0, "rgba(255,230,180,0.15)");
      haze.addColorStop(1, "rgba(200,150,50,0.1)");
      ctx.fillStyle = haze;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    } else if (def.name === "지구") {
      // Continents
      ctx.fillStyle = "rgba(34,139,34,0.5)";
      // Large continent
      ctx.beginPath();
      ctx.ellipse(x - r * 0.15, y - r * 0.1, r * 0.35, r * 0.45, 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Small continent
      ctx.beginPath();
      ctx.ellipse(x + r * 0.35, y + r * 0.25, r * 0.2, r * 0.25, -0.5, 0, Math.PI * 2);
      ctx.fill();
      // Ice cap
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.ellipse(x, y - r * 0.85, r * 0.4, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      // Clouds
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.ellipse(x + r * 0.2, y - r * 0.3, r * 0.4, r * 0.08, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x - r * 0.3, y + r * 0.4, r * 0.3, r * 0.06, 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (def.name === "화성") {
      // Surface texture + polar cap
      ctx.fillStyle = "rgba(150,60,30,0.3)";
      ctx.beginPath();
      ctx.ellipse(x + r * 0.2, y - r * 0.1, r * 0.5, r * 0.35, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(100,40,20,0.2)";
      ctx.beginPath();
      ctx.ellipse(x - r * 0.3, y + r * 0.3, r * 0.3, r * 0.2, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // Polar cap
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.ellipse(x, y - r * 0.85, r * 0.3, r * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      // Olympus Mons (dark spot)
      ctx.fillStyle = "rgba(80,30,15,0.25)";
      ctx.beginPath();
      ctx.arc(x + r * 0.15, y + r * 0.05, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    } else if (def.name === "목성") {
      // Horizontal bands
      const bandColors = ["rgba(200,140,80,0.3)", "rgba(160,100,60,0.25)", "rgba(220,170,100,0.2)", "rgba(180,110,60,0.3)", "rgba(200,150,90,0.25)"];
      for (let i = 0; i < 8; i++) {
        const bandY = y - r + i * (r * 2 / 8);
        ctx.fillStyle = bandColors[i % bandColors.length];
        ctx.fillRect(x - r, bandY, r * 2, r * 2 / 8);
      }
      // Great Red Spot
      ctx.fillStyle = "rgba(200,80,50,0.5)";
      ctx.beginPath();
      ctx.ellipse(x + r * 0.25, y + r * 0.2, r * 0.18, r * 0.12, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(220,100,60,0.3)";
      ctx.beginPath();
      ctx.ellipse(x + r * 0.25, y + r * 0.2, r * 0.12, r * 0.07, 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else if (def.name === "천왕성") {
      // Subtle vertical bands (tilted planet)
      ctx.fillStyle = "rgba(100,200,200,0.15)";
      for (let i = 0; i < 5; i++) {
        const bx = x - r * 0.6 + i * r * 0.3;
        ctx.fillRect(bx, y - r, r * 0.15, r * 2);
      }
      // Atmosphere glow
      const atm = ctx.createRadialGradient(x, y, r * 0.7, x, y, r);
      atm.addColorStop(0, "rgba(100,220,220,0)");
      atm.addColorStop(1, "rgba(60,180,180,0.2)");
      ctx.fillStyle = atm;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    } else if (def.name === "해왕성") {
      // Storm bands
      ctx.fillStyle = "rgba(30,50,150,0.2)";
      for (let i = 0; i < 6; i++) {
        const bandY = y - r + i * (r * 2 / 6);
        ctx.fillRect(x - r, bandY, r * 2, r * 2 / 12);
      }
      // Great Dark Spot
      ctx.fillStyle = "rgba(10,20,80,0.4)";
      ctx.beginPath();
      ctx.ellipse(x - r * 0.2, y - r * 0.15, r * 0.2, r * 0.13, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // White cloud streaks
      ctx.fillStyle = "rgba(200,220,255,0.2)";
      ctx.beginPath();
      ctx.ellipse(x + r * 0.1, y + r * 0.3, r * 0.35, r * 0.04, -0.15, 0, Math.PI * 2);
      ctx.fill();
    } else if (def.name === "태양") {
      // Solar texture - granulation
      ctx.fillStyle = "rgba(255,150,0,0.2)";
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const dist = r * (0.3 + (i * 7 % 5) * 0.1);
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      // Sunspots
      ctx.fillStyle = "rgba(200,100,0,0.3)";
      ctx.beginPath();
      ctx.arc(x + r * 0.2, y - r * 0.1, r * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - r * 0.3, y + r * 0.25, r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore(); // un-clip

    // Ring for Saturn (drawn outside clip)
    if (def.ring) {
      // Back ring
      ctx.strokeStyle = `rgba(200, 180, 120, ${0.3 * alpha})`;
      ctx.lineWidth = r * 0.08;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.6, r * 0.35, -0.15, Math.PI * 0.05, Math.PI * 0.95);
      ctx.stroke();
      // Planet body on top
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      const satGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      satGrad.addColorStop(0, def.color1);
      satGrad.addColorStop(1, def.color2);
      ctx.fillStyle = satGrad;
      ctx.fill();
      // Front ring
      ctx.strokeStyle = `rgba(210, 190, 130, ${0.5 * alpha})`;
      ctx.lineWidth = r * 0.1;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.6, r * 0.35, -0.15, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
      // Inner ring
      ctx.strokeStyle = `rgba(180, 160, 100, ${0.3 * alpha})`;
      ctx.lineWidth = r * 0.05;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.35, r * 0.28, -0.15, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
    }

    // Glow for sun (drawn outside clip)
    if (def.glow) {
      const glowGrad = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 2);
      glowGrad.addColorStop(0, "rgba(255, 200, 0, 0.2)");
      glowGrad.addColorStop(0.5, "rgba(255, 150, 0, 0.08)");
      glowGrad.addColorStop(1, "rgba(255, 100, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x, y, r * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Highlight (specular)
    const hlGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, 1, x - r * 0.15, y - r * 0.15, r * 0.5);
    hlGrad.addColorStop(0, "rgba(255,255,255,0.4)");
    hlGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = hlGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Edge darkening (atmosphere)
    const edgeGrad = ctx.createRadialGradient(x, y, r * 0.6, x, y, r);
    edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
    edgeGrad.addColorStop(1, "rgba(0,0,0,0.2)");
    ctx.fillStyle = edgeGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, []);

  // Physics step
  const physicsStep = useCallback((state: typeof gameStateRef.current) => {
    const { bodies } = state;

    // Apply gravity & damping
    for (const b of bodies) {
      b.vy += GRAVITY;
      b.vx *= DAMPING;
      b.vy *= DAMPING;
      b.x += b.vx;
      b.y += b.vy;
    }

    // Wall collisions
    for (const b of bodies) {
      // Left wall
      if (b.x - b.radius < WALL_LEFT) {
        b.x = WALL_LEFT + b.radius;
        b.vx = Math.abs(b.vx) * RESTITUTION;
      }
      // Right wall
      if (b.x + b.radius > WALL_RIGHT) {
        b.x = WALL_RIGHT - b.radius;
        b.vx = -Math.abs(b.vx) * RESTITUTION;
      }
      // Bottom wall
      if (b.y + b.radius > WALL_BOTTOM) {
        b.y = WALL_BOTTOM - b.radius;
        b.vy = -Math.abs(b.vy) * RESTITUTION;
        b.vx *= (1 - FRICTION);
        if (Math.abs(b.vy) < 1) {
          b.vy = 0;
          b.settled = true;
        }
      }
    }

    // Circle-circle collisions & merging
    const toRemove = new Set<number>();
    const toAdd: Body[] = [];

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];
        if (toRemove.has(a.id) || toRemove.has(b.id)) continue;

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.radius + b.radius;

        if (dist < minDist) {
          // Same type? Merge!
          if (a.type === b.type && a.type < PLANETS.length - 1) {
            toRemove.add(a.id);
            toRemove.add(b.id);
            const newType = a.type + 1;
            const newDef = PLANETS[newType];
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            toAdd.push({
              id: state.nextId++,
              type: newType,
              x: mx,
              y: my,
              vx: (a.vx + b.vx) * 0.3,
              vy: (a.vy + b.vy) * 0.3 - 2,
              radius: newDef.radius,
              settled: false,
            });
            state.score += newDef.points;
            state.mergeEffects.push({ x: mx, y: my, radius: newDef.radius, frame: 0 });
          } else {
            // Separate & bounce
            const overlap = minDist - dist;
            const nx = dist > 0.001 ? dx / dist : 0;
            const ny = dist > 0.001 ? dy / dist : 1;
            const sep = overlap / 2 + 0.5;
            a.x -= nx * sep;
            a.y -= ny * sep;
            b.x += nx * sep;
            b.y += ny * sep;

            // Relative velocity along normal
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const dvn = dvx * nx + dvy * ny;

            if (dvn > 0) {
              const massA = a.radius * a.radius;
              const massB = b.radius * b.radius;
              const totalMass = massA + massB;
              const impulse = dvn * (1 + RESTITUTION) / totalMass;

              a.vx -= impulse * massB * nx;
              a.vy -= impulse * massB * ny;
              b.vx += impulse * massA * nx;
              b.vy += impulse * massA * ny;
            }
          }
        }
      }
    }

    // Apply removals and additions
    if (toRemove.size > 0) {
      state.bodies = bodies.filter((b) => !toRemove.has(b.id));
      state.bodies.push(...toAdd);
    }

    // Check danger line (game over)
    if (!state.gameOver) {
      let anyAbove = false;
      for (const b of state.bodies) {
        if (b.y - b.radius < DANGER_Y && Math.abs(b.vy) < 2) {
          anyAbove = true;
          break;
        }
      }
      if (anyAbove) {
        state.dangerFrames++;
        if (state.dangerFrames > GAME_OVER_GRACE_FRAMES) {
          state.gameOver = true;
        }
      } else {
        state.dangerFrames = 0;
      }
    }

    // Drop cooldown
    if (state.dropCooldown > 0) {
      state.dropCooldown--;
      if (state.dropCooldown === 0) {
        state.canDrop = true;
      }
    }
  }, []);

  // Render frame
  const render = useCallback((ctx: CanvasRenderingContext2D, state: typeof gameStateRef.current) => {
    const w = CANVAS_W;
    const h = CANVAS_H;

    // Background - dark space
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "#0a0a2e");
    bgGrad.addColorStop(1, "#1a1a3e");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 97 + 13) % w);
      const sy = ((i * 61 + 7) % h);
      const sr = (i % 3 === 0) ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Walls
    ctx.fillStyle = "rgba(100, 120, 200, 0.3)";
    ctx.fillRect(0, 0, WALL_LEFT, h);
    ctx.fillRect(WALL_RIGHT, 0, w - WALL_RIGHT, h);
    ctx.fillRect(0, WALL_BOTTOM, w, h - WALL_BOTTOM);

    // Danger line
    ctx.setLineDash([8, 6]);
    const dangerAlpha = state.dangerFrames > 0 ? 0.5 + Math.sin(Date.now() * 0.01) * 0.3 : 0.4;
    ctx.strokeStyle = `rgba(255, 60, 60, ${dangerAlpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(WALL_LEFT, DANGER_Y);
    ctx.lineTo(WALL_RIGHT, DANGER_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // "DANGER" text
    ctx.fillStyle = `rgba(255, 60, 60, ${dangerAlpha * 0.7})`;
    ctx.font = "bold 10px -apple-system, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("DANGER", WALL_RIGHT - 5, DANGER_Y - 5);

    // Drop preview (guide line + planet)
    if (!state.gameOver && state.canDrop) {
      const def = PLANETS[state.currentPlanet];
      // Guide line
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(state.dropX, DANGER_Y + def.radius);
      ctx.lineTo(state.dropX, WALL_BOTTOM);
      ctx.stroke();
      ctx.setLineDash([]);

      // Preview planet at top
      drawPlanet(ctx, state.dropX, DANGER_Y - 10, def, 0.7);
    }

    // Merge effects
    for (let i = state.mergeEffects.length - 1; i >= 0; i--) {
      const eff = state.mergeEffects[i];
      eff.frame++;
      const progress = eff.frame / 20;
      if (progress > 1) {
        state.mergeEffects.splice(i, 1);
        continue;
      }
      const effRadius = eff.radius * (1 + progress * 2);
      const effAlpha = 0.5 * (1 - progress);
      ctx.strokeStyle = `rgba(255, 255, 200, ${effAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(eff.x, eff.y, effRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw bodies
    for (const b of state.bodies) {
      drawPlanet(ctx, b.x, b.y, PLANETS[b.type]);
    }

    // Game over overlay
    if (state.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 28px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("게임 오버!", w / 2, h / 2 - 30);
      ctx.font = "16px -apple-system, sans-serif";
      ctx.fillText(`점수: ${state.score.toLocaleString()}`, w / 2, h / 2 + 10);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "14px -apple-system, sans-serif";
      ctx.fillText("'새 게임' 버튼을 누르세요", w / 2, h / 2 + 45);
    }
  }, [drawPlanet]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const loop = () => {
      if (!running) return;
      const state = gameStateRef.current;

      if (!state.gameOver) {
        physicsStep(state);
      }

      render(ctx, state);

      // Sync React state
      setScore(state.score);
      if (state.gameOver) setGameOver(true);

      if (state.score > state.bestScore) {
        state.bestScore = state.score;
        setBestScore(state.score);
        localStorage.setItem("bestPlanetMerge", String(state.score));
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [physicsStep, render]);

  // Drop planet
  const dropPlanet = useCallback(() => {
    const state = gameStateRef.current;
    if (state.gameOver || !state.canDrop) return;

    const def = PLANETS[state.currentPlanet];
    const dropX = Math.max(WALL_LEFT + def.radius + 2, Math.min(WALL_RIGHT - def.radius - 2, state.dropX));

    state.bodies.push({
      id: state.nextId++,
      type: state.currentPlanet,
      x: dropX,
      y: DANGER_Y - 10,
      vx: 0,
      vy: 1,
      radius: def.radius,
      settled: false,
    });

    state.canDrop = false;
    state.dropCooldown = 30; // ~0.5sec cooldown

    state.currentPlanet = state.nextPlanet;
    state.nextPlanet = Math.floor(Math.random() * (DROP_PLANET_MAX + 1));
    setCurrentPlanet(state.currentPlanet);
    setNextPlanet(state.nextPlanet);
  }, []);

  // Handle pointer move (update dropX)
  const handlePointerMove = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const x = (clientX - rect.left) * scaleX;
    gameStateRef.current.dropX = Math.max(WALL_LEFT + 15, Math.min(WALL_RIGHT - 15, x));
  }, []);

  // Mouse events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX);
    };
    const onClick = (e: MouseEvent) => {
      handlePointerMove(e.clientX);
      dropPlanet();
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [handlePointerMove, dropPlanet]);

  // Touch events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (e.changedTouches.length > 0) {
        handlePointerMove(e.changedTouches[0].clientX);
      }
      dropPlanet();
    };

    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [handlePointerMove, dropPlanet]);

  // New game
  const newGame = useCallback(() => {
    const state = gameStateRef.current;
    state.bodies = [];
    state.score = 0;
    state.gameOver = false;
    state.canDrop = true;
    state.dropCooldown = 0;
    state.dangerFrames = 0;
    state.dropX = CANVAS_W / 2;
    state.mergeEffects = [];
    const c = Math.floor(Math.random() * (DROP_PLANET_MAX + 1));
    const n = Math.floor(Math.random() * (DROP_PLANET_MAX + 1));
    state.currentPlanet = c;
    state.nextPlanet = n;
    setScore(0);
    setGameOver(false);
    setCurrentPlanet(c);
    setNextPlanet(n);
  }, []);

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        {"\uD83E\uDE90"} 행성 합치기
      </h1>
      <p className="text-gray-500 mb-6">
        같은 행성을 합쳐 더 큰 행성을 만드세요! 수성부터 태양까지 진화시키세요.
      </p>

      {/* Score & Controls */}
      <div className="flex items-center justify-between mb-4 gap-3 max-w-[360px]">
        <div className="flex gap-3">
          <div className="bg-gray-700 text-white rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="text-[10px] uppercase tracking-wider text-gray-300">점수</div>
            <div className="text-lg font-bold">{score.toLocaleString()}</div>
          </div>
          <div className="bg-gray-700 text-white rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="text-[10px] uppercase tracking-wider text-gray-300">최고</div>
            <div className="text-lg font-bold">{bestScore.toLocaleString()}</div>
          </div>
        </div>
        <button
          onClick={newGame}
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          새 게임
        </button>
      </div>

      {/* Next planet preview */}
      <div className="mb-3 flex items-center gap-3 max-w-[360px]">
        <span className="text-sm text-gray-500">다음 행성:</span>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
          <span
            className="inline-block rounded-full"
            style={{
              width: Math.max(16, PLANETS[nextPlanet].radius * 0.7),
              height: Math.max(16, PLANETS[nextPlanet].radius * 0.7),
              background: `radial-gradient(circle at 35% 35%, ${PLANETS[nextPlanet].color1}, ${PLANETS[nextPlanet].color2})`,
            }}
          />
          <span className="text-sm font-medium text-gray-700">{PLANETS[nextPlanet].name}</span>
        </div>
      </div>

      {/* Game Canvas */}
      <div ref={containerRef} className="relative max-w-[360px]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full rounded-xl border-2 border-gray-700 cursor-crosshair touch-none"
          style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
        />
      </div>

      {/* How to play */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-[360px]">
        <p className="text-sm text-gray-600">
          <strong>조작법:</strong> 마우스(PC) 또는 터치(모바일)로 위치를 정한 뒤 클릭/탭하여 행성을 떨어뜨리세요. 같은 행성끼리 부딪히면 합쳐져 더 큰 행성이 됩니다!
        </p>
      </div>

      {/* Evolution chain */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-[360px]">
        <p className="text-sm font-medium text-gray-700 mb-2">행성 진화 순서:</p>
        <div className="flex flex-wrap gap-1.5">
          {PLANETS.map((p, i) => (
            <div key={i} className="flex items-center gap-1">
              <span
                className="inline-block rounded-full flex-shrink-0"
                style={{
                  width: Math.max(12, p.radius * 0.4),
                  height: Math.max(12, p.radius * 0.4),
                  background: `radial-gradient(circle at 35% 35%, ${p.color1}, ${p.color2})`,
                }}
              />
              <span className="text-xs text-gray-600">{p.name}</span>
              {i < PLANETS.length - 1 && <span className="text-gray-300 text-xs mx-0.5">{"\u2192"}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            행성 합치기 게임이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            행성 합치기는 물리 엔진 기반의 퍼즐 게임입니다. 같은 종류의 행성을 합쳐서
            더 큰 행성으로 진화시키는 것이 목표입니다. 수성(가장 작은 행성)부터 시작해서
            금성, 지구, 화성, 목성, 토성, 천왕성, 해왕성을 거쳐 궁극적으로 태양을
            만들어 보세요!
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            게임 규칙
          </h2>
          <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
            <li>화면 상단에서 행성을 떨어뜨릴 위치를 선택합니다.</li>
            <li>같은 종류의 행성이 부딪히면 합쳐져 다음 단계의 행성이 됩니다.</li>
            <li>합치기를 할 때마다 점수를 얻으며, 큰 행성일수록 높은 점수를 받습니다.</li>
            <li>행성이 빨간 위험선 위로 올라가면 게임이 종료됩니다.</li>
            <li>행성은 중력의 영향을 받아 떨어지고, 서로 부딪히며 굴러갑니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            행성 합치기 공략 팁
          </h2>
          <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
            <li>
              <strong>큰 행성은 한쪽에:</strong> 큰 행성을 한쪽 벽에 모아두면 작은 행성들을 합치기 쉽습니다.
            </li>
            <li>
              <strong>연쇄 합치기:</strong> 같은 행성을 나란히 쌓으면 연쇄적으로 합쳐져 높은 점수를 얻을 수 있습니다.
            </li>
            <li>
              <strong>공간 관리:</strong> 행성이 위험선까지 쌓이지 않도록 빈 공간을 확보하세요.
            </li>
            <li>
              <strong>떨어뜨리기 전 계획:</strong> 다음에 올 행성을 미리 확인하고 전략적으로 위치를 정하세요.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">최고 점수는 저장되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 최고 점수는 브라우저의 로컬 스토리지에 자동으로 저장됩니다.
                같은 브라우저에서 다시 방문하면 이전 최고 점수를 확인할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">모바일에서도 플레이할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 모바일 기기에서 화면을 터치하여 행성을 떨어뜨릴 수 있습니다.
                손가락으로 좌우로 움직여 위치를 정하고, 화면에서 손을 떼면 행성이 떨어집니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">태양을 만들 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                이론적으로 가능합니다! 해왕성 두 개를 합치면 태양이 됩니다.
                하지만 그만큼의 행성을 합치려면 상당한 공간 관리와 전략이 필요합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="planet-merge" />
    </div>
  );
}
