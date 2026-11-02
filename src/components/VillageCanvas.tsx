import React, { useRef, useEffect, useState } from 'react';
import { Character, LevelData, Clue } from '../types';
import { soundEngine } from '../utils/audio';
import { MessageSquare, Eye, Swords, Lock, ShieldCheck, Sparkles, MapPin, Compass } from 'lucide-react';

interface VillageCanvasProps {
  character: Character;
  level: LevelData;
  hasLearnedLesson: boolean;
  collectedClues: string[];
  collectedShards: string[];
  onInteractMaster: () => void;
  onInteractMonster: () => void;
  onInspectClue: (clue: Clue) => void;
  onCollectShard: (shardId: string) => void;
}

export const VillageCanvas: React.FC<VillageCanvasProps> = ({
  character,
  level,
  hasLearnedLesson,
  collectedClues,
  collectedShards,
  onInteractMaster,
  onInteractMonster,
  onInspectClue,
  onCollectShard,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Announcement card when entering new level
  const [announcement, setAnnouncement] = useState<{
    chapter: number;
    title: string;
    location: string;
    description: string;
  } | null>({
    chapter: level.id,
    title: level.name,
    location: level.locationName,
    description: level.description,
  });

  // Player position & state
  const playerRef = useRef({
    x: level.playerSpawn.x,
    y: level.playerSpawn.y,
    vx: 0,
    vy: 0,
    direction: 'down' as 'up' | 'down' | 'left' | 'right',
    isMoving: false,
    frame: 0,
    stepTimer: 0,
  });

  // World bounds
  const WORLD_WIDTH = 1200;
  const WORLD_HEIGHT = 800;

  // Active interaction near player
  const [nearbyMaster, setNearbyMaster] = useState(false);
  const [nearbyMonster, setNearbyMonster] = useState(false);
  const [nearbyClue, setNearbyClue] = useState<Clue | null>(null);

  // Virtual mobile touch joystick state
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchCurrentRef = useRef<{ x: number; y: number } | null>(null);
  const [touchActive, setTouchActive] = useState(false);

  // Keyboard input tracking
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const battleTriggeredRef = useRef(false);

  useEffect(() => {
    battleTriggeredRef.current = false;
    playerRef.current.x = level.playerSpawn.x;
    playerRef.current.y = level.playerSpawn.y;
    setAnnouncement({
      chapter: level.id,
      title: level.name,
      location: level.locationName,
      description: level.description,
    });
    const timer = setTimeout(() => {
      setAnnouncement(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [level.id, level.name, level.locationName, level.description, level.playerSpawn.x, level.playerSpawn.y]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Space', 'PageUp', 'PageDown'].includes(e.key) || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.code] = true;

      // Interaction key [E] or Space
      if (e.key.toLowerCase() === 'e' || e.code === 'KeyE' || e.key === ' ') {
        if (nearbyMaster) {
          onInteractMaster();
        } else if (nearbyMonster && hasLearnedLesson) {
          onInteractMonster();
        } else if (nearbyClue) {
          onInspectClue(nearbyClue);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyMaster, nearbyMonster, hasLearnedLesson, nearbyClue, onInteractMaster, onInteractMonster, onInspectClue]);

  // Main 60fps Game Loop & Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let animTime = 0;

    // Environmental Obstacles & Structures from active Level
    const structures = level.structures || [];

    // Floating crystal decorative clusters
    const naturalCrystals = [
      { x: 260, y: 260, color: level.theme.primaryColor, size: 24 },
      { x: 580, y: 140, color: level.theme.primaryColor, size: 30 },
      { x: 480, y: 600, color: level.theme.primaryColor, size: 28 },
      { x: 820, y: 640, color: level.theme.primaryColor, size: 22 },
      { x: 1040, y: 220, color: level.theme.primaryColor, size: 34 },
    ];

    const render = () => {
      animTime += 0.03;
      const p = playerRef.current;

      // Handle Input Movement
      let dx = 0;
      let dy = 0;
      const speed = character.speed;

      if (keysRef.current['arrowup'] || keysRef.current['w'] || keysRef.current['keyw']) dy -= 1;
      if (keysRef.current['arrowdown'] || keysRef.current['s'] || keysRef.current['keys']) dy += 1;
      if (keysRef.current['arrowleft'] || keysRef.current['a'] || keysRef.current['keya']) dx -= 1;
      if (keysRef.current['arrowright'] || keysRef.current['d'] || keysRef.current['keyd']) dx += 1;

      // Virtual Joystick touch input
      if (touchStartRef.current && touchCurrentRef.current) {
        const jx = touchCurrentRef.current.x - touchStartRef.current.x;
        const jy = touchCurrentRef.current.y - touchStartRef.current.y;
        const dist = Math.hypot(jx, jy);
        if (dist > 15) {
          dx = jx / dist;
          dy = jy / dist;
        }
      }

      if (dx !== 0 && dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;
      }

      p.isMoving = dx !== 0 || dy !== 0;

      if (p.isMoving) {
        if (Math.abs(dx) > Math.abs(dy)) {
          p.direction = dx > 0 ? 'right' : 'left';
        } else {
          p.direction = dy > 0 ? 'down' : 'up';
        }

        const nextX = p.x + dx * speed;
        const nextY = p.y + dy * speed;

        const radius = 18;
        let canMoveX = nextX >= radius && nextX <= WORLD_WIDTH - radius;
        let canMoveY = nextY >= radius && nextY <= WORLD_HEIGHT - radius;

        structures.forEach((struct) => {
          if (
            nextX + radius > struct.x &&
            nextX - radius < struct.x + struct.w &&
            p.y + radius > struct.y &&
            p.y - radius < struct.y + struct.h
          ) {
            canMoveX = false;
          }
          if (
            p.x + radius > struct.x &&
            p.x - radius < struct.x + struct.w &&
            nextY + radius > struct.y &&
            nextY - radius < struct.y + struct.h
          ) {
            canMoveY = false;
          }
        });

        if (canMoveX) p.x = nextX;
        if (canMoveY) p.y = nextY;

        p.stepTimer += 1;
        if (p.stepTimer > 18) {
          p.stepTimer = 0;
          soundEngine.playFootstep();
        }
      }

      // Check proximity to Master (Teacher/Mentor)
      const distToMaster = Math.hypot(p.x - level.masterPosition.x, p.y - level.masterPosition.y);
      setNearbyMaster(distToMaster < 75);

      // Check proximity to Monster
      const distToMonster = Math.hypot(p.x - level.monsterPosition.x, p.y - level.monsterPosition.y);
      setNearbyMonster(distToMonster < 85);

      // AUTO-ENTER BATTLE: After learning lesson, walking near the monster directly enters battle without pressing E!
      if (distToMonster < 80 && hasLearnedLesson && !battleTriggeredRef.current) {
        battleTriggeredRef.current = true;
        soundEngine.playBattleEncounter();
        onInteractMonster();
      }

      // Check proximity to Clues
      let foundClue: Clue | null = null;
      level.clues.forEach((c) => {
        const dist = Math.hypot(p.x - c.x, p.y - c.y);
        if (dist < 50) {
          foundClue = c;
        }
      });
      setNearbyClue(foundClue);

      // Check pickup of Crystal Shards
      level.shards.forEach((s) => {
        if (!collectedShards.includes(s.id)) {
          const dist = Math.hypot(p.x - s.x, p.y - s.y);
          if (dist < 32) {
            onCollectShard(s.id);
          }
        }
      });

      // --- RENDERING CANVAS ---
      const screenW = canvas.parentElement?.clientWidth || window.innerWidth;
      const screenH = canvas.parentElement?.clientHeight || window.innerHeight;
      if (canvas.width !== screenW || canvas.height !== screenH) {
        canvas.width = screenW;
        canvas.height = screenH;
      }

      let cameraX = p.x - screenW / 2;
      let cameraY = p.y - screenH / 2;
      cameraX = Math.max(0, Math.min(WORLD_WIDTH - screenW, cameraX));
      cameraY = Math.max(0, Math.min(WORLD_HEIGHT - screenH, cameraY));

      ctx.save();
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, screenW, screenH);
      ctx.translate(-cameraX, -cameraY);

      // 1. Village Ground & Environment by mapType
      ctx.fillStyle = level.theme.floorColor;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      if (level.mapType === 'courtyard') {
        // Courtyard flagstones & cyan lanterns
        ctx.strokeStyle = level.theme.stoneColor;
        ctx.lineWidth = 1;
        const tileSize = 48;
        for (let x = 0; x < WORLD_WIDTH; x += tileSize) {
          for (let y = 0; y < WORLD_HEIGHT; y += tileSize) {
            ctx.strokeRect(x, y, tileSize, tileSize);
            if ((x * 13 + y * 17) % 19 === 0) {
              ctx.fillStyle = level.theme.ambientGlow;
              ctx.fillRect(x + 12, y + 12, 6, 6);
            }
          }
        }
      } else if (level.mapType === 'forest_grove') {
        // Rich emerald moss with organic grass tufts & fireflies
        ctx.strokeStyle = '#064e3b';
        ctx.lineWidth = 1;
        for (let x = 0; x < WORLD_WIDTH; x += 60) {
          for (let y = 0; y < WORLD_HEIGHT; y += 60) {
            ctx.fillStyle = (x + y) % 120 === 0 ? '#064e3b' : '#052e16';
            ctx.fillRect(x, y, 60, 60);
          }
        }
        for (let i = 0; i < 22; i++) {
          const fx = ((i * 67 + animTime * 15) % WORLD_WIDTH);
          const fy = ((i * 91 + Math.sin(animTime + i) * 24) % WORLD_HEIGHT);
          ctx.fillStyle = 'rgba(52, 211, 153, 0.45)';
          ctx.beginPath();
          ctx.arc(fx, fy, 2.5 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (level.mapType === 'cloud_canyon') {
        // Volcanic cliff rock with swirling abyss
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 2;
        for (let x = 0; x < WORLD_WIDTH; x += 80) {
          for (let y = 0; y < WORLD_HEIGHT; y += 80) {
            ctx.strokeRect(x, y, 80, 80);
          }
        }
        const abyssGrad = ctx.createLinearGradient(410, 0, 790, 0);
        abyssGrad.addColorStop(0, '#090d16');
        abyssGrad.addColorStop(0.5, '#030712');
        abyssGrad.addColorStop(1, '#090d16');
        ctx.fillStyle = abyssGrad;
        ctx.fillRect(410, 0, 380, WORLD_HEIGHT);

        for (let i = 0; i < 16; i++) {
          const cx = 430 + ((i * 41 + animTime * 14) % 320);
          const cy = (i * 59 + animTime * 10) % WORLD_HEIGHT;
          ctx.fillStyle = `rgba(148, 163, 184, ${0.09 + Math.sin(animTime + i) * 0.04})`;
          ctx.beginPath();
          ctx.arc(cx, cy, 38 + (i % 24), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (level.mapType === 'conflict_gorge') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        ctx.strokeStyle = '#312e81';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < WORLD_WIDTH; x += 64) {
          for (let y = 0; y < WORLD_HEIGHT; y += 64) {
            ctx.strokeRect(x, y, 64, 64);
          }
        }
        ctx.font = 'bold 10px monospace';
        const pulse = Math.sin(animTime * 3) * 0.2 + 0.6;
        ctx.fillStyle = `rgba(244, 63, 94, ${pulse})`;
        ctx.fillText('<<<<<<< HEAD [CONFLICT FAULT] =======', 240, 290);
        ctx.fillText('>>>>>>> feature/divergent-branch', 620, 290);
        ctx.fillText('<<<<<<< HEAD ======= >>>>>>> branch', 380, 500);
      } else if (level.mapType === 'celestial_nexus') {
        ctx.fillStyle = '#050212';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        for (let i = 0; i < 45; i++) {
          const sx = (i * 97) % WORLD_WIDTH;
          const sy = (i * 83) % WORLD_HEIGHT;
          const twinkle = Math.sin(animTime * 4 + i) * 0.35 + 0.65;
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
          ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.lineWidth = 1.5;
        const ringGlow = Math.sin(animTime * 2) * 0.15 + 0.3;
        ctx.strokeStyle = `rgba(236, 72, 153, ${ringGlow})`;
        ctx.beginPath();
        ctx.arc(600, 400, 180, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(56, 189, 248, ${ringGlow})`;
        ctx.beginPath();
        ctx.arc(600, 400, 320, 0, Math.PI * 2);
        ctx.stroke();
      } else if (level.mapType === 'py_oasis') {
        // Python Chapter 1: Variable Desert Oasis with Shimmering Turquoise Lagoon
        ctx.fillStyle = '#291804'; // Warm desert bedrock
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        
        // Wind-swept golden dunes
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.18)';
        ctx.lineWidth = 2;
        for (let y = 0; y < WORLD_HEIGHT; y += 45) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.bezierCurveTo(300, y + Math.sin(y + animTime) * 15, 800, y - Math.sin(y - animTime) * 15, WORLD_WIDTH, y);
          ctx.stroke();
        }

        // Central Turquoise Oasis Lake (between x=380 and x=720, y=260 and y=520)
        const lakeGrad = ctx.createRadialGradient(550, 390, 30, 550, 390, 180);
        lakeGrad.addColorStop(0, '#06b6d4');
        lakeGrad.addColorStop(0.7, '#0891b2');
        lakeGrad.addColorStop(1, '#0e7490');
        ctx.fillStyle = lakeGrad;
        ctx.beginPath();
        ctx.ellipse(550, 390, 170, 110, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shimmering Water Caustic Highlights
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          const wx = 460 + i * 28 + Math.sin(animTime * 2 + i) * 10;
          const wy = 350 + (i % 3) * 25;
          ctx.beginPath();
          ctx.arc(wx, wy, 16 + (i % 8), 0, Math.PI);
          ctx.stroke();
        }

        // Oasis Shoreline Grass Fringe
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(550, 390, 176, 116, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Python Hieroglyphics in Sand
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.fillText('str = "py" • int = 42 • float = 3.14', 120, 120);
        ctx.fillText('type(x) -> dynamic memory reference', 680, 720);
      } else if (level.mapType === 'py_citadel') {
        // Python Chapter 2: Control Citadel - Ancient Stone Labyrinth
        ctx.fillStyle = '#062015';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Labyrinth Stone Cobblestone with glowing moss
        ctx.strokeStyle = '#064e3b';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < WORLD_WIDTH; x += 55) {
          for (let y = 0; y < WORLD_HEIGHT; y += 55) {
            ctx.strokeRect(x, y, 55, 55);
            if ((x * 7 + y * 11) % 13 === 0) {
              ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
              ctx.fillRect(x + 5, y + 5, 45, 45);
            }
          }
        }

        // Branching logic runes etched in stone
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = 'rgba(74, 222, 128, 0.35)';
        ctx.fillText('if condition: -> True', 160, 200);
        ctx.fillText('elif alt_condition: -> Branch', 450, 140);
        ctx.fillText('else: -> Fallback', 820, 200);
        ctx.fillText('while loop_active: break', 520, 680);

        // Ambient green spore motes
        for (let i = 0; i < 20; i++) {
          const sx = (i * 61 + animTime * 12) % WORLD_WIDTH;
          const sy = (i * 47 + Math.sin(animTime + i) * 20) % WORLD_HEIGHT;
          ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
          ctx.beginPath();
          ctx.arc(sx, sy, 2 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (level.mapType === 'py_forge') {
        // Python Chapter 3: Function Forge - Volcanic Basalt & Rivers of Molten Magma
        ctx.fillStyle = '#140c08';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Magma River flowing through the middle
        const magmaGrad = ctx.createLinearGradient(420, 0, 780, 0);
        magmaGrad.addColorStop(0, '#7f1d1d');
        magmaGrad.addColorStop(0.3, '#dc2626');
        magmaGrad.addColorStop(0.5, '#f97316');
        magmaGrad.addColorStop(0.7, '#ea580c');
        magmaGrad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = magmaGrad;
        ctx.fillRect(430, 0, 340, WORLD_HEIGHT);

        // Bubbling lava pockets & embers
        for (let i = 0; i < 18; i++) {
          const ex = 450 + ((i * 39 + animTime * 18) % 300);
          const ey = (i * 53 + animTime * 15) % WORLD_HEIGHT;
          const glow = Math.sin(animTime * 3 + i) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(254, 240, 138, ${glow})`;
          ctx.beginPath();
          ctx.arc(ex, ey, 3 + (i % 4), 0, Math.PI * 2);
          ctx.fill();
        }

        // Basalt crack patterns
        ctx.strokeStyle = '#431407';
        ctx.lineWidth = 2;
        for (let x = 0; x < WORLD_WIDTH; x += 75) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + 20, WORLD_HEIGHT);
          ctx.stroke();
        }
      } else if (level.mapType === 'py_vault') {
        // Python Chapter 4: Collection Vaults - Royal Purple Amethyst Crypt
        ctx.fillStyle = '#0f0a1e';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Marble Checkerboard Tiles
        for (let x = 0; x < WORLD_WIDTH; x += 60) {
          for (let y = 0; y < WORLD_HEIGHT; y += 60) {
            ctx.fillStyle = ((x / 60 + y / 60) % 2 === 0) ? '#1e153b' : '#130c27';
            ctx.fillRect(x, y, 60, 60);
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
            ctx.strokeRect(x, y, 60, 60);
          }
        }

        // Golden & Violet Crystal Matrix Rune Veins
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = 'rgba(192, 132, 252, 0.4)';
        ctx.fillText('List: [1, 2, 3] (Mutable)', 140, 120);
        ctx.fillText('Tuple: (1, 2, 3) (Locked)', 520, 120);
        ctx.fillText('Dict: {"key": value} -> O(1)', 140, 720);
        ctx.fillText('dict.get(key, default) SAFE', 520, 720);
      } else if (level.mapType === 'py_spire') {
        // Python Chapter 5: Bytecode Apex Spire - Cosmic Dragon Summit
        ctx.fillStyle = '#0a0314';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Distant starry cosmic abyss
        for (let i = 0; i < 40; i++) {
          const sx = (i * 103) % WORLD_WIDTH;
          const sy = (i * 79) % WORLD_HEIGHT;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(sx, sy, 2, 2);
        }

        // Swirling Nebula Cloud Rings
        const ringGlow = Math.sin(animTime * 2) * 0.2 + 0.4;
        ctx.strokeStyle = `rgba(244, 63, 94, ${ringGlow})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(600, 400, 240, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(250, 204, 21, ${ringGlow})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(600, 400, 360, 0, Math.PI * 2);
        ctx.stroke();
      } else if (level.mapType === 'web_haven') {
        // Web Dev Chapter 1: Semantic Shore - Ocean Coastline & Beach
        // Sand beach on left (0 to 450)
        ctx.fillStyle = '#292015'; // Dark sandy shore
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Rolling Ocean Waters on Right (450 to WORLD_WIDTH)
        const seaGrad = ctx.createLinearGradient(450, 0, WORLD_WIDTH, 0);
        seaGrad.addColorStop(0, '#0284c7');
        seaGrad.addColorStop(0.5, '#0369a1');
        seaGrad.addColorStop(1, '#0c4a6e');
        ctx.fillStyle = seaGrad;
        ctx.fillRect(450, 0, WORLD_WIDTH - 450, WORLD_HEIGHT);

        // Animated Sea Wave crests & foam
        for (let i = 0; i < 10; i++) {
          const wy = i * 85 + Math.sin(animTime * 2 + i) * 15;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(460, wy);
          ctx.bezierCurveTo(600, wy + 20, 800, wy - 20, WORLD_WIDTH, wy);
          ctx.stroke();
        }

        // HTML Semantic Tag Shore Glyphs
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
        ctx.fillText('<!DOCTYPE html>', 120, 140);
        ctx.fillText('<header> <nav> </header>', 120, 170);
        ctx.fillText('<main> PRIMARY UNIQUE CONTENT </main>', 120, 680);
      } else if (level.mapType === 'web_bastion') {
        // Web Dev Chapter 2: Cascade Bastion - CSS Box Model & Grid Cyber Harbor
        ctx.fillStyle = '#061626';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // High-tech CSS Grid ground tiles
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < WORLD_WIDTH; x += 60) {
          for (let y = 0; y < WORLD_HEIGHT; y += 60) {
            ctx.strokeRect(x, y, 60, 60);
          }
        }

        // Giant CSS Box Model etched in courtyard
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.strokeRect(360, 200, 480, 360); // Margin
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
        ctx.strokeRect(400, 240, 400, 280); // Border
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.strokeRect(440, 280, 320, 200); // Padding

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('MARGIN', 370, 225);
        ctx.fillStyle = '#06b6d4';
        ctx.fillText('BORDER', 410, 265);
        ctx.fillStyle = '#10b981';
        ctx.fillText('PADDING: box-sizing: border-box', 450, 305);
      } else if (level.mapType === 'web_amphitheater') {
        // Web Dev Chapter 3: DOM Amphitheater - Concentric Stone Colosseum
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Concentric Colosseum Tiers
        for (let r = 80; r <= 380; r += 60) {
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(600, 400, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // DOM Node branch lines
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(600, 400);
        ctx.lineTo(350, 220);
        ctx.moveTo(600, 400);
        ctx.lineTo(850, 220);
        ctx.moveTo(600, 400);
        ctx.lineTo(600, 650);
        ctx.stroke();

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#f472b6';
        ctx.fillText('document.querySelector("#node")', 240, 160);
        ctx.fillText('addEventListener("click", eventHandler)', 500, 720);
      } else if (level.mapType === 'web_causeway') {
        // Web Dev Chapter 4: Asynchronous Causeway - Data Highway over Digital Void
        ctx.fillStyle = '#040714';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Streaming Data Highway cables
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 3;
        for (let y = 100; y < WORLD_HEIGHT; y += 80) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(WORLD_WIDTH, y);
          ctx.stroke();
        }

        // Traveling HTTP Data Packets along the lines
        for (let i = 0; i < 12; i++) {
          const px = ((i * 110 + animTime * 90) % WORLD_WIDTH);
          const py = 100 + (i % 8) * 80;
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(px, py - 4, 18, 8);
          ctx.fillStyle = '#22c55e';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('HTTP', px, py - 8);
        }
      } else if (level.mapType === 'web_sanctum') {
        // Web Dev Chapter 5: Component Sanctum - Floating React Atom Celestial Core
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // Cosmic backdrop
        for (let i = 0; i < 50; i++) {
          const sx = (i * 89) % WORLD_WIDTH;
          const sy = (i * 97) % WORLD_HEIGHT;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.fillRect(sx, sy, 2, 2);
        }

        // Rotating React Atom Orbits in Center
        const atomAngle = animTime * 1.5;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#06b6d4';
        
        ctx.beginPath();
        ctx.ellipse(600, 400, 160, 60, atomAngle, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(600, 400, 160, 60, atomAngle + (Math.PI / 3), 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(600, 400, 160, 60, atomAngle + (2 * Math.PI / 3), 0, Math.PI * 2);
        ctx.stroke();

        // Atom Core
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(600, 400, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#67e8f9';
        ctx.fillText('useState() • useEffect() • Virtual DOM', 460, 220);
      }

      // Render Level Pathways with biome-specific styling
      (level.paths || []).forEach((path) => {
        if (level.mapType === 'py_oasis') {
          // Warm desert stone flagstone with gold edge
          ctx.fillStyle = '#78350f';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'py_citadel') {
          // Ancient mossy flagstone with green glow
          ctx.fillStyle = '#064e3b';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'py_forge') {
          // Steel grating bridge over lava
          ctx.fillStyle = '#292524';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
          for (let bx = path.x; bx < path.x + path.w; bx += 18) {
            ctx.beginPath();
            ctx.moveTo(bx, path.y);
            ctx.lineTo(bx, path.y + path.h);
            ctx.stroke();
          }
        } else if (level.mapType === 'py_vault') {
          // Polished amethyst marble
          ctx.fillStyle = '#2e1065';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'py_spire') {
          // High mountain dragon trail
          ctx.fillStyle = '#3b0764';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 2;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'web_haven') {
          // Wooden boardwalk pier with nautical planks
          ctx.fillStyle = '#451a03';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          for (let bx = path.x; bx < path.x + path.w; bx += 14) {
            ctx.beginPath();
            ctx.moveTo(bx, path.y);
            ctx.lineTo(bx, path.y + path.h);
            ctx.stroke();
          }
        } else if (level.mapType === 'web_bastion') {
          // Glass cyber-tile walkway
          ctx.fillStyle = '#082f49';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#0ea5e9';
          ctx.lineWidth = 2;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'web_amphitheater') {
          // Colosseum stone promenade
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'web_causeway') {
          // Glowing fiber optic highway
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'web_sanctum') {
          // Holographic light bridge
          ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'cloud_canyon') {
          // Suspension bridge across the abyss
          if (path.x >= 400 && path.x + path.w <= 800) {
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(path.x, path.y, path.w, path.h);
            ctx.strokeStyle = '#5d4037';
            ctx.lineWidth = 2;
            for (let bx = path.x; bx < path.x + path.w; bx += 14) {
              ctx.beginPath();
              ctx.moveTo(bx, path.y);
              ctx.lineTo(bx, path.y + path.h);
              ctx.stroke();
            }
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(path.x, path.y);
            ctx.lineTo(path.x + path.w, path.y);
            ctx.moveTo(path.x, path.y + path.h);
            ctx.lineTo(path.x + path.w, path.y + path.h);
            ctx.stroke();
          } else {
            ctx.fillStyle = '#292524';
            ctx.fillRect(path.x, path.y, path.w, path.h);
          }
        } else if (level.mapType === 'conflict_gorge') {
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#4338ca';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'celestial_nexus') {
          ctx.fillStyle = 'rgba(30, 27, 75, 0.7)';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 2;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else if (level.mapType === 'forest_grove') {
          ctx.fillStyle = '#272015';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#382e1c';
          ctx.lineWidth = 2;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        } else {
          // Standard Courtyard
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(path.x, path.y, path.w, path.h);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.strokeRect(path.x, path.y, path.w, path.h);
        }
      });

      // 2. Render Level Structures
      structures.forEach((struct) => {
        if (struct.type === 'house') {
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.fillRect(struct.x + 10, struct.y + 10, struct.w, struct.h);
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.fillRect(struct.x, struct.y, struct.w, struct.h);
          ctx.strokeRect(struct.x, struct.y, struct.w, struct.h);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(struct.x + 6, struct.y + 6, struct.w - 12, struct.h * 0.45);
          const winGlow = Math.sin(animTime * 2 + struct.x) * 0.15 + 0.35;
          ctx.fillStyle = `rgba(56, 189, 248, ${winGlow})`;
          ctx.fillRect(struct.x + struct.w / 2 - 14, struct.y + struct.h * 0.65, 28, 24);
          if (struct.label) {
            ctx.fillStyle = '#64748b';
            ctx.font = '10px monospace';
            ctx.fillText(struct.label, struct.x + 10, struct.y + struct.h + 16);
          }
        } else if (struct.type === 'tree') {
          // Ancient Canopy Trees
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          ctx.beginPath();
          ctx.ellipse(struct.x + struct.w / 2 + 8, struct.y + struct.h / 2 + 10, struct.w / 2, struct.h / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.arc(struct.x + struct.w / 2, struct.y + struct.h / 2, struct.w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#047857';
          ctx.beginPath();
          ctx.arc(struct.x + struct.w / 2, struct.y + struct.h / 2 - 8, struct.w / 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(struct.x + struct.w / 2, struct.y + struct.h / 2 - 14, struct.w / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1c1208';
          ctx.beginPath();
          ctx.arc(struct.x + struct.w / 2, struct.y + struct.h / 2 + 8, 12, 0, Math.PI * 2);
          ctx.fill();
          if (struct.label) {
            ctx.fillStyle = '#a7f3d0';
            ctx.font = '10px monospace';
            ctx.fillText(struct.label, struct.x + 10, struct.y + struct.h + 16);
          }
        } else if (struct.type === 'chasm') {
          ctx.fillStyle = 'rgba(4, 7, 17, 0.9)';
          ctx.fillRect(struct.x, struct.y, struct.w, struct.h);
        } else if (struct.type === 'obelisk') {
          ctx.fillStyle = 'rgba(0,0,0,0.45)';
          ctx.fillRect(struct.x + 8, struct.y + 8, struct.w, struct.h);
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = level.theme.primaryColor;
          ctx.lineWidth = 2;
          ctx.fillRect(struct.x, struct.y, struct.w, struct.h);
          ctx.strokeRect(struct.x, struct.y, struct.w, struct.h);
          const pulseH = ((animTime * 40) % struct.h);
          ctx.fillStyle = level.theme.primaryColor;
          ctx.fillRect(struct.x + struct.w / 2 - 2, struct.y + pulseH, 4, 16);
          if (struct.label) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px monospace';
            ctx.fillText(struct.label, struct.x + 4, struct.y + struct.h + 16);
          }
        } else if (struct.type === 'rock') {
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.fillRect(struct.x + 6, struct.y + 6, struct.w, struct.h);
          ctx.fillStyle = '#1e1b4b';
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 2;
          ctx.fillRect(struct.x, struct.y, struct.w, struct.h);
          ctx.strokeRect(struct.x, struct.y, struct.w, struct.h);
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.moveTo(struct.x + 20, struct.y + 20);
          ctx.lineTo(struct.x + 35, struct.y + 10);
          ctx.lineTo(struct.x + 30, struct.y + 35);
          ctx.closePath();
          ctx.fill();
          if (struct.label) {
            ctx.fillStyle = '#c4b5fd';
            ctx.font = '10px monospace';
            ctx.fillText(struct.label, struct.x + 6, struct.y + struct.h + 16);
          }
        } else if (struct.type === 'shrine') {
          ctx.strokeStyle = level.master.themeColor;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(struct.x, struct.y, struct.w, struct.h);
          ctx.fillStyle = `${level.master.themeColor}22`;
          ctx.fillRect(struct.x, struct.y, struct.w, struct.h);
          if (struct.label) {
            ctx.fillStyle = level.master.themeColor;
            ctx.font = '10px monospace';
            ctx.fillText(struct.label, struct.x + 8, struct.y + struct.h + 14);
          }
        } else if (struct.type === 'portal') {
          ctx.strokeStyle = hasLearnedLesson ? '#ef4444' : '#475569';
          ctx.lineWidth = 3;
          ctx.strokeRect(struct.x, struct.y, struct.w, struct.h);
          ctx.fillStyle = hasLearnedLesson ? 'rgba(239, 68, 68, 0.2)' : 'rgba(30, 41, 59, 0.4)';
          ctx.fillRect(struct.x, struct.y, struct.w, struct.h);
          if (struct.label) {
            ctx.fillStyle = hasLearnedLesson ? '#fca5a5' : '#64748b';
            ctx.font = '10px monospace';
            ctx.fillText(struct.label, struct.x + 8, struct.y + struct.h + 14);
          }
        } else if (struct.type === 'pillar') {
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          ctx.fillRect(struct.x + 4, struct.y + 4, struct.w, struct.h);
          ctx.fillStyle = '#334155';
          ctx.fillRect(struct.x, struct.y, struct.w, struct.h);
          ctx.fillStyle = level.theme.primaryColor;
          ctx.fillRect(struct.x + 10, struct.y + 10, struct.w - 20, struct.h - 20);
        }
      });

      // 3. Render Collectible Crystal Shards
      level.shards.forEach((s) => {
        if (!collectedShards.includes(s.id)) {
          const hover = Math.sin(animTime * 4 + s.x) * 4;
          ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
          ctx.beginPath();
          ctx.arc(s.x, s.y + hover, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - 10 + hover);
          ctx.lineTo(s.x + 6, s.y + hover);
          ctx.lineTo(s.x, s.y + 10 + hover);
          ctx.lineTo(s.x - 6, s.y + hover);
          ctx.closePath();
          ctx.fill();
        }
      });

      // 4. Render Clues
      level.clues.forEach((c) => {
        const isDiscovered = collectedClues.includes(c.id);
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = isDiscovered ? '#38bdf8' : '#eab308';
        ctx.lineWidth = 2;
        ctx.strokeRect(c.x - 14, c.y - 18, 28, 36);
        ctx.fillRect(c.x - 14, c.y - 18, 28, 36);

        ctx.fillStyle = isDiscovered ? 'rgba(56, 189, 248, 0.8)' : 'rgba(234, 179, 8, 0.8)';
        ctx.font = '14px serif';
        ctx.fillText('git', c.x - 9, c.y + 4);
      });

      // 5. Render THE MASTER (Peaceful Mentor & Teacher)
      const mx = level.masterPosition.x;
      const my = level.masterPosition.y;
      const masterFloat = Math.sin(animTime * 2.2) * 3.5;

      // Master Peaceful Aura
      const mAura = ctx.createRadialGradient(mx, my, 8, mx, my, 60);
      mAura.addColorStop(0, `${level.master.themeColor}66`);
      mAura.addColorStop(1, 'transparent');
      ctx.fillStyle = mAura;
      ctx.beginPath();
      ctx.arc(mx, my, 60, 0, Math.PI * 2);
      ctx.fill();

      // Master Robes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(mx - 16, my + 24);
      ctx.lineTo(mx + 16, my + 24);
      ctx.lineTo(mx + 10, my - 16 + masterFloat);
      ctx.lineTo(mx - 10, my - 16 + masterFloat);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = level.master.themeColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Master Head
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(mx, my - 24 + masterFloat, 14, 0, Math.PI * 2);
      ctx.fill();

      // Master Serene Eyes
      ctx.fillStyle = level.master.themeColor;
      ctx.beginPath();
      ctx.arc(mx - 4, my - 24 + masterFloat, 2.5, 0, Math.PI * 2);
      ctx.arc(mx + 4, my - 24 + masterFloat, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Floating Git Repository Branch Rune above Master
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText(level.master.name, mx, my - 44 + masterFloat);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText(`[Mentor • ${level.master.title}]`, mx, my - 58 + masterFloat);

      // Indicator badge on Master: Ready to teach
      if (!hasLearnedLesson) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(mx, my - 72 + masterFloat, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('!', mx, my - 69 + masterFloat);
      } else {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(mx, my - 72 + masterFloat, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Render THE MONSTER (Corrupted Git Entity blocking the path!)
      const bx = level.monsterPosition.x;
      const by = level.monsterPosition.y;
      const bFloat = Math.sin(animTime * 3.5) * 5;

      // Monster Corrupted Red/Glitch Aura
      const bAura = ctx.createRadialGradient(bx, by, 10, bx, by, 75);
      bAura.addColorStop(0, hasLearnedLesson ? 'rgba(239, 68, 68, 0.7)' : 'rgba(100, 116, 139, 0.4)');
      bAura.addColorStop(1, 'transparent');
      ctx.fillStyle = bAura;
      ctx.beginPath();
      ctx.arc(bx, by, 75, 0, Math.PI * 2);
      ctx.fill();

      // Glitch code particles swirling around monster
      for (let i = 0; i < 5; i++) {
        const gAngle = animTime * 3 + (i * Math.PI * 2) / 5;
        const gx = bx + Math.cos(gAngle) * 44;
        const gy = by + Math.sin(gAngle) * 25 + bFloat;
        ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f59e0b';
        ctx.fillRect(gx - 3, gy - 3, 6, 6);
      }

      // Monster Spiky Body
      ctx.fillStyle = '#450a0a';
      ctx.strokeStyle = hasLearnedLesson ? '#ef4444' : '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx - 26, by + 28);
      ctx.lineTo(bx - 32, by + 10 + bFloat);
      ctx.lineTo(bx - 22, by - 10 + bFloat);
      ctx.lineTo(bx - 30, by - 32 + bFloat);
      ctx.lineTo(bx, by - 48 + bFloat);
      ctx.lineTo(bx + 30, by - 32 + bFloat);
      ctx.lineTo(bx + 22, by - 10 + bFloat);
      ctx.lineTo(bx + 32, by + 10 + bFloat);
      ctx.lineTo(bx + 26, by + 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Monster Glowing Menacing Eyes
      ctx.fillStyle = hasLearnedLesson ? '#facc15' : '#94a3b8';
      ctx.beginPath();
      ctx.arc(bx - 9, by - 24 + bFloat, 4, 0, Math.PI * 2);
      ctx.arc(bx + 9, by - 24 + bFloat, 4, 0, Math.PI * 2);
      ctx.fill();

      // Monster Claws / Horns
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Cinzel, serif';
      ctx.fillText(level.monster.name, bx, by - 58 + bFloat);
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px monospace';
      ctx.fillText(`[CORRUPTED ENTITY: ${level.monster.title}]`, bx, by - 72 + bFloat);

      // 7. Render Player Character
      const px = p.x;
      const py = p.y;
      const walkBob = p.isMoving ? Math.sin(animTime * 14) * 2.5 : Math.sin(animTime * 2) * 1.2;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(px, py + 16, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = character.glowColor;
      ctx.beginPath();
      ctx.arc(px, py, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = character.color;
      ctx.beginPath();
      ctx.moveTo(px - 12, py + 14);
      ctx.lineTo(px + 12, py + 14);
      ctx.lineTo(px + 8, py - 10 + walkBob);
      ctx.lineTo(px - 8, py - 10 + walkBob);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px - 9, py + 2 + walkBob, 18, 4);

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(px, py - 16 + walkBob, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = character.secondaryColor;
      let eyeOffsetX = 0;
      let eyeOffsetY = 0;
      if (p.direction === 'left') eyeOffsetX = -3;
      if (p.direction === 'right') eyeOffsetX = 3;
      if (p.direction === 'up') eyeOffsetY = -2;
      if (p.direction === 'down') eyeOffsetY = 2;

      ctx.beginPath();
      ctx.arc(px - 3 + eyeOffsetX, py - 16 + walkBob + eyeOffsetY, 2, 0, Math.PI * 2);
      ctx.arc(px + 3 + eyeOffsetX, py - 16 + walkBob + eyeOffsetY, 2, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Fog
      ctx.fillStyle = level.theme.fogColor;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      ctx.restore();

      // Minimap
      const mapW = 140;
      const mapH = 95;
      const mapX = screenW - mapW - 16;
      const mapY = 16;

      ctx.save();
      ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.fillRect(mapX, mapY, mapW, mapH);
      ctx.strokeRect(mapX, mapY, mapW, mapH);

      const scaleX = mapW / WORLD_WIDTH;
      const scaleY = mapH / WORLD_HEIGHT;

      // Draw Clues
      ctx.fillStyle = '#eab308';
      level.clues.forEach((c) => {
        ctx.fillRect(mapX + c.x * scaleX - 1.5, mapY + c.y * scaleY - 1.5, 3, 3);
      });

      // Draw Master (Cyan dot)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(mapX + level.masterPosition.x * scaleX, mapY + level.masterPosition.y * scaleY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw Monster (Red dot)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(mapX + level.monsterPosition.x * scaleX, mapY + level.monsterPosition.y * scaleY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw Player (White/Cyan dot)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mapX + p.x * scaleX, mapY + p.y * scaleY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px monospace';
      ctx.fillText('MAP', mapX + 6, mapY + 12);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [character, level, hasLearnedLesson, collectedClues, collectedShards, onCollectShard]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
    setTouchActive(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    touchCurrentRef.current = null;
    setTouchActive(false);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none bg-slate-950"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Chapter Entrance Cinematic Title Banner */}
      {announcement && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-700 animate-in fade-in zoom-in-95">
          <div className="relative px-8 py-5 rounded-3xl bg-slate-950/95 border-2 border-cyan-400/60 shadow-[0_0_60px_rgba(6,182,212,0.45)] backdrop-blur-2xl text-center flex flex-col items-center max-w-lg mx-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] uppercase tracking-widest border border-cyan-400/40 mb-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Chapter {announcement.chapter} Discovered</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400 font-['Cinzel'] tracking-wider drop-shadow-md">
              {announcement.location}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-serif italic mt-1.5 text-center leading-relaxed">
              {announcement.description}
            </p>
          </div>
        </div>
      )}

      {/* Persistent Map Location Badge (Top-Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/85 border border-slate-700/80 backdrop-blur-md shadow-lg">
        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-['Cinzel'] text-xs font-bold text-slate-200 tracking-wide">
          {level.locationName}
        </span>
        <span className="text-slate-500 text-xs">•</span>
        <span className="font-mono text-[10px] text-cyan-300/80">
          Chapter {level.id}
        </span>
      </div>

      {/* Interactive Prompt: Master (Teacher/Mentor) */}
      {(() => {
        const disc = level.master.gitDiscipline.toLowerCase();
        const subjectTitle = disc.includes('python')
          ? 'Python'
          : disc.includes('html') || disc.includes('css') || disc.includes('dom') || disc.includes('web') || disc.includes('react')
          ? 'Web Dev'
          : 'Git';

        return (
          <>
            {nearbyMaster && (
              <div className="absolute bottom-28 md:bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                <button
                  onClick={() => onInteractMaster()}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 text-slate-950 font-bold font-['Cinzel'] tracking-wide shadow-2xl shadow-cyan-400/50 hover:scale-105 active:scale-95 transition-transform animate-bounce cursor-pointer border-2 border-white/50"
                >
                  <MessageSquare className="w-5 h-5 text-slate-950" />
                  <span>
                    {hasLearnedLesson
                      ? `Consult ${level.master.name} [E]`
                      : `Learn from ${subjectTitle} Master ${level.master.name} [E]`}
                  </span>
                </button>
              </div>
            )}

            {/* Interactive Prompt: Monster Battle */}
            {nearbyMonster && !nearbyMaster && (
              <div className="absolute bottom-28 md:bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                {hasLearnedLesson ? (
                  <button
                    onClick={() => onInteractMonster()}
                    className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 text-white font-bold font-['Cinzel'] tracking-wide shadow-2xl shadow-red-500/50 hover:scale-105 active:scale-95 transition-transform animate-bounce cursor-pointer border-2 border-white/50"
                  >
                    <Swords className="w-5 h-5 text-white" />
                    <span>Battle {level.monster.name} with {subjectTitle} Knowledge! [E]</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 border border-red-500/50 text-slate-300 font-mono text-xs shadow-xl backdrop-blur-md">
                    <Lock className="w-4 h-4 text-red-400" />
                    <span>Path Blocked! Talk to {subjectTitle} Master {level.master.name} to learn the lesson first!</span>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Prompt: Clue */}
            {nearbyClue && !nearbyMaster && !nearbyMonster && (
              <div className="absolute bottom-28 md:bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                <button
                  onClick={() => onInspectClue(nearbyClue)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono tracking-wide shadow-xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-amber-200"
                >
                  <Eye className="w-4 h-4 text-slate-950" />
                  <span>Inspect {subjectTitle} Clue: {nearbyClue.title} [E]</span>
                </button>
              </div>
            )}

            {/* Quest Guidance Banner */}
            {!nearbyMaster && !nearbyMonster && !nearbyClue && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/85 border border-cyan-800/40 text-xs font-mono text-cyan-200/90 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>
                  {hasLearnedLesson
                    ? `Lesson Mastered! Move forward to confront ${level.monster.name}!`
                    : `Step 1: Speak with ${subjectTitle} Master ${level.master.name} at the sanctuary to study the lesson.`}
                </span>
              </div>
            )}
          </>
        );
      })()}

      {/* On-screen Directional Touch Pad for mobile devices */}
      <div className="md:hidden absolute bottom-6 left-6 z-20 pointer-events-auto opacity-70 hover:opacity-100 transition-opacity">
        <div className="w-28 h-28 rounded-full border-2 border-cyan-500/40 bg-slate-950/70 backdrop-blur-sm relative flex items-center justify-center">
          <span className="text-[10px] font-mono text-cyan-400/80">DRAG TO MOVE</span>
          {touchActive && touchStartRef.current && touchCurrentRef.current && (
            <div
              className="absolute w-10 h-10 rounded-full bg-cyan-400/60 pointer-events-none"
              style={{
                transform: `translate(${Math.max(-30, Math.min(30, touchCurrentRef.current.x - touchStartRef.current.x))}px, ${Math.max(-30, Math.min(30, touchCurrentRef.current.y - touchStartRef.current.y))}px)`,
              }}
            />
          )}
        </div>
      </div>

      {/* Action [E] Button on Mobile */}
      <div className="md:hidden absolute bottom-6 right-6 z-20 pointer-events-auto">
        <button
          onClick={() => {
            if (nearbyMaster) onInteractMaster();
            else if (nearbyMonster && hasLearnedLesson) onInteractMonster();
            else if (nearbyClue) onInspectClue(nearbyClue);
          }}
          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg border-2 shadow-xl ${
            nearbyMaster || (nearbyMonster && hasLearnedLesson) || nearbyClue
              ? 'bg-cyan-500 border-white text-slate-950 animate-pulse'
              : 'bg-slate-900/80 border-slate-700 text-slate-400'
          }`}
        >
          E
        </button>
      </div>
    </div>
  );
};
