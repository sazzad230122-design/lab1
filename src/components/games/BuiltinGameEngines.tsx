import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Sparkles } from 'lucide-react';

interface GameEngineProps {
  engineId?: string;
  embedUrl: string;
  gameTitle: string;
  onScoreAchieved?: (score: number) => void;
}

// Simple Web Audio API sound generator
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  laser() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  explosion() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {}
  }

  ping() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }
}

export const sfx = new SoundFX();

export const BuiltinGameEngine: React.FC<GameEngineProps> = ({
  engineId,
  embedUrl,
  gameTitle,
  onScoreAchieved,
}) => {
  const [mode, setMode] = useState<'builtin' | 'iframe'>(engineId ? 'builtin' : 'iframe');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Toggle sound
  const toggleSound = () => {
    sfx.enabled = !soundOn;
    setSoundOn(!soundOn);
  };

  // If built-in engine is requested and available
  if (mode === 'builtin' && engineId) {
    if (engineId === 'starfighter') {
      return (
        <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center select-none overflow-hidden">
          <StarfighterCanvas onScoreAchieved={onScoreAchieved} />
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={soundOn ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={() => setMode('iframe')}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            >
              Switch to External Embed
            </button>
          </div>
        </div>
      );
    }

    if (engineId === 'snake') {
      return (
        <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center select-none overflow-hidden">
          <SnakeCanvas onScoreAchieved={onScoreAchieved} />
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={soundOn ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={() => setMode('iframe')}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            >
              Switch to External Embed
            </button>
          </div>
        </div>
      );
    }

    if (engineId === 'brickbreaker') {
      return (
        <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center select-none overflow-hidden">
          <BrickBreakerCanvas onScoreAchieved={onScoreAchieved} />
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title={soundOn ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={() => setMode('iframe')}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            >
              Switch to External Embed
            </button>
          </div>
        </div>
      );
    }

    if (engineId === '2048') {
      return (
        <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center select-none overflow-hidden p-4">
          <Game2048Board onScoreAchieved={onScoreAchieved} />
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <button
              onClick={() => setMode('iframe')}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            >
              Switch to External Embed
            </button>
          </div>
        </div>
      );
    }

    if (engineId === 'memorymatrix') {
      return (
        <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center select-none overflow-hidden p-4">
          <MemoryMatrixBoard onScoreAchieved={onScoreAchieved} />
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <button
              onClick={() => setMode('iframe')}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            >
              Switch to External Embed
            </button>
          </div>
        </div>
      );
    }
  }

  // Fallback or Iframe Embed Mode
  return (
    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      {!iframeLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-300 z-10 gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
          <p className="text-sm font-medium tracking-wide">Loading {gameTitle}...</p>
          <p className="text-xs text-slate-500 max-w-sm text-center">
            Initializing secure HTML5 sandbox container.
          </p>
        </div>
      )}

      {/* 
        Sandboxed iframe for maximum security:
        - allow-scripts: for game execution
        - allow-same-origin: required by most HTML5 web games
        - allow-pointer-lock: for mouse tracking in 3D/FPS games
      */}
      <iframe
        src={embedUrl}
        title={gameTitle}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-fullscreen allow-pointer-lock"
        allow="autoplay; fullscreen; gamepad"
        loading="lazy"
        onLoad={() => setIframeLoaded(true)}
      />

      {engineId && (
        <div className="absolute bottom-3 right-3 z-20">
          <button
            onClick={() => setMode('builtin')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Play Native Arcade Version
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 1. NEON STARFIGHTER CANVAS GAME
// ==========================================
const StarfighterCanvas: React.FC<{ onScoreAchieved?: (score: number) => void }> = ({ onScoreAchieved }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let currentScore = 0;
    let lives = 3;
    let isRunning = gameState === 'PLAYING';

    const width = 800;
    const height = 450;
    canvas.width = width;
    canvas.height = height;

    // Player Ship
    const player = {
      x: width / 2 - 20,
      y: height - 60,
      w: 40,
      h: 36,
      vx: 0,
      speed: 6,
    };

    // Bullets, Asteroids, Stars, Particles
    const bullets: { x: number; y: number; vy: number }[] = [];
    const asteroids: { x: number; y: number; r: number; vy: number; rot: number; rotSpeed: number }[] = [];
    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
    const stars: { x: number; y: number; speed: number; size: number }[] = [];

    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.5 + Math.random() * 2,
        size: Math.random() * 2,
      });
    }

    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (e.code === 'Space' && gameState === 'PLAYING') {
        e.preventDefault();
        bullets.push({ x: player.x + player.w / 2, y: player.y, vy: -10 });
        sfx.laser();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let spawnTimer = 0;

    const gameLoop = () => {
      // Clear
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, width, height);

      // Starfield
      ctx.fillStyle = '#ffffff';
      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      if (isRunning) {
        // Player Input
        if (keys['ArrowLeft'] || keys['KeyA']) player.vx = -player.speed;
        else if (keys['ArrowRight'] || keys['KeyD']) player.vx = player.speed;
        else player.vx = 0;

        player.x += player.vx;
        if (player.x < 10) player.x = 10;
        if (player.x > width - player.w - 10) player.x = width - player.w - 10;

        // Draw Player Ship (Neon Jet)
        ctx.save();
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.moveTo(player.x + player.w / 2, player.y);
        ctx.lineTo(player.x + player.w, player.y + player.h);
        ctx.lineTo(player.x + player.w / 2, player.y + player.h - 10);
        ctx.lineTo(player.x, player.y + player.h);
        ctx.closePath();
        ctx.fill();

        // Thruster flame
        ctx.fillStyle = Math.random() > 0.5 ? '#f97316' : '#ec4899';
        ctx.beginPath();
        ctx.moveTo(player.x + player.w / 2 - 6, player.y + player.h - 8);
        ctx.lineTo(player.x + player.w / 2 + 6, player.y + player.h - 8);
        ctx.lineTo(player.x + player.w / 2, player.y + player.h + 10 + Math.random() * 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Update Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.y += b.vy;
          ctx.save();
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(b.x - 2, b.y, 4, 12);
          ctx.restore();
          if (b.y < -10) bullets.splice(i, 1);
        }

        // Spawn Asteroids
        spawnTimer++;
        if (spawnTimer > 35) {
          spawnTimer = 0;
          asteroids.push({
            x: 30 + Math.random() * (width - 60),
            y: -30,
            r: 16 + Math.random() * 18,
            vy: 2 + Math.random() * 3,
            rot: 0,
            rotSpeed: (Math.random() - 0.5) * 0.05,
          });
        }

        // Update Asteroids
        for (let i = asteroids.length - 1; i >= 0; i--) {
          const a = asteroids[i];
          a.y += a.vy;
          a.rot += a.rotSpeed;

          // Draw Asteroid
          ctx.save();
          ctx.translate(a.x, a.y);
          ctx.rotate(a.rot);
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 10;
          ctx.strokeStyle = '#fb7185';
          ctx.lineWidth = 2;
          ctx.fillStyle = '#1e112a';
          ctx.beginPath();
          ctx.arc(0, 0, a.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Bullet Collision
          for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            const dist = Math.hypot(b.x - a.x, b.y - a.y);
            if (dist < a.r + 4) {
              sfx.explosion();
              // Spawn particles
              for (let p = 0; p < 8; p++) {
                particles.push({
                  x: a.x,
                  y: a.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 1,
                  color: Math.random() > 0.5 ? '#f43f5e' : '#fb923c',
                });
              }
              asteroids.splice(i, 1);
              bullets.splice(j, 1);
              currentScore += 100;
              setScore(currentScore);
              break;
            }
          }

          // Player Collision
          if (asteroids[i]) {
            const pDist = Math.hypot(player.x + player.w / 2 - a.x, player.y + player.h / 2 - a.y);
            if (pDist < a.r + 15) {
              sfx.explosion();
              asteroids.splice(i, 1);
              lives--;
              if (lives <= 0) {
                isRunning = false;
                setGameState('GAMEOVER');
                setHighScore((prev) => Math.max(prev, currentScore));
                if (onScoreAchieved) onScoreAchieved(currentScore);
              }
            }
          }

          if (a.y > height + 40) asteroids.splice(i, 1);
        }

        // Update Particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.04;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(p.x, p.y, 3, 3);
          ctx.globalAlpha = 1;
          if (p.life <= 0) particles.splice(i, 1);
        }

        // HUD: Score & Lives
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 16px 'Outfit', sans-serif";
        ctx.fillText(`SCORE: ${currentScore}`, 20, 30);
        ctx.fillText(`LIVES: ${'❤️ '.repeat(lives)}`, width - 120, 30);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div className="relative w-full max-w-[800px] aspect-[16/9] mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Start Overlay */}
      {gameState === 'START' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">NEON STARFIGHTER</h2>
          <p className="text-sm text-slate-300 max-w-md mb-6">
            Use <strong className="text-purple-400">A / D</strong> or <strong className="text-purple-400">Arrow Keys</strong> to maneuver. Press <strong className="text-purple-400">SPACE</strong> to fire plasma blasters.
          </p>
          <button
            onClick={() => setGameState('PLAYING')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" /> Launch Fighter
          </button>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center mb-3">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">MISSION DEFEAT</h2>
          <p className="text-lg text-purple-300 font-semibold mb-1">Final Score: {score}</p>
          <p className="text-xs text-slate-400 mb-6">Your score has been registered for leaderboard entry!</p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setScore(0);
                setGameState('PLAYING');
              }}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow transition-transform hover:scale-105 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. RETRO SNAKE CANVAS GAME
// ==========================================
const SnakeCanvas: React.FC<{ onScoreAchieved?: (score: number) => void }> = ({ onScoreAchieved }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;
    const width = 600;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    let snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    let food = { x: 15, y: 10 };
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let currentScore = 0;
    let gameInterval: number;

    const spawnFood = () => {
      food = {
        x: Math.floor(Math.random() * (width / gridSize)),
        y: Math.floor(Math.random() * (height / gridSize)),
      };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'ArrowUp' || e.code === 'KeyW') && dir.y === 0) nextDir = { x: 0, y: -1 };
      if ((e.code === 'ArrowDown' || e.code === 'KeyS') && dir.y === 0) nextDir = { x: 0, y: 1 };
      if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && dir.x === 0) nextDir = { x: -1, y: 0 };
      if ((e.code === 'ArrowRight' || e.code === 'KeyD') && dir.x === 0) nextDir = { x: 1, y: 0 };
    };

    window.addEventListener('keydown', handleKeyDown);

    const tick = () => {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= width / gridSize || head.y < 0 || head.y >= height / gridSize) {
        clearInterval(gameInterval);
        setGameState('GAMEOVER');
        sfx.explosion();
        if (onScoreAchieved) onScoreAchieved(currentScore);
        return;
      }

      // Self collision
      if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        clearInterval(gameInterval);
        setGameState('GAMEOVER');
        sfx.explosion();
        if (onScoreAchieved) onScoreAchieved(currentScore);
        return;
      }

      snake.unshift(head);

      // Eat Food
      if (head.x === food.x && head.y === food.y) {
        currentScore += 150;
        setScore(currentScore);
        sfx.ping();
        spawnFood();
      } else {
        snake.pop();
      }

      // Draw
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, width, height);

      // Grid subtle lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Food (Neon Berry)
      ctx.save();
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Snake
      snake.forEach((seg, i) => {
        ctx.save();
        ctx.shadowColor = i === 0 ? '#38bdf8' : '#818cf8';
        ctx.shadowBlur = 8;
        ctx.fillStyle = i === 0 ? '#38bdf8' : '#6366f1';
        ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
        ctx.restore();
      });

      // HUD
      ctx.fillStyle = '#94a3b8';
      ctx.font = "bold 14px 'Outfit', sans-serif";
      ctx.fillText(`SCORE: ${currentScore}`, 16, 24);
    };

    gameInterval = window.setInterval(tick, 90);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);

  return (
    <div className="relative w-full max-w-[600px] aspect-[3/2] mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      <canvas ref={canvasRef} className="w-full h-full block bg-slate-950" />

      {gameState === 'START' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10">
          <h2 className="text-2xl font-bold text-white mb-2">RETRO SNAKE MANIA</h2>
          <p className="text-xs text-slate-300 mb-6">Use WASD or Arrow Keys to devour neon energy orbs.</p>
          <button
            onClick={() => {
              setScore(0);
              setGameState('PLAYING');
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> Start Game
          </button>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10">
          <h2 className="text-2xl font-bold text-white mb-1">GAME OVER</h2>
          <p className="text-base text-emerald-400 font-semibold mb-4">Score: {score}</p>
          <button
            onClick={() => {
              setScore(0);
              setGameState('PLAYING');
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. BRICK BREAKER DELUXE CANVAS GAME
// ==========================================
const BrickBreakerCanvas: React.FC<{ onScoreAchieved?: (score: number) => void }> = ({ onScoreAchieved }) => {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('START');
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 640;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    let animId: number;
    let currentScore = 0;

    // Paddle
    const paddle = {
      w: 90,
      h: 12,
      x: width / 2 - 45,
      y: height - 25,
      speed: 7,
      vx: 0,
    };

    // Ball
    const ball = {
      x: width / 2,
      y: height - 50,
      r: 6,
      vx: 3.5 * (Math.random() > 0.5 ? 1 : -1),
      vy: -4,
    };

    // Bricks
    const rows = 4;
    const cols = 8;
    const brickW = 68;
    const brickH = 18;
    const brickPadding = 6;
    const offsetTop = 40;
    const offsetLeft = (width - (cols * (brickW + brickPadding) - brickPadding)) / 2;

    const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];
    const bricks: { x: number; y: number; alive: boolean; color: string }[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetLeft + c * (brickW + brickPadding),
          y: offsetTop + r * (brickH + brickPadding),
          alive: true,
          color: colors[r % colors.length],
        });
      }
    }

    const keys: { [key: string]: boolean } = {};
    const handleKeyDown = (e: KeyboardEvent) => { keys[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.code] = false; };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * width;
      paddle.x = Math.max(0, Math.min(width - paddle.w, mouseX - paddle.w / 2));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    const loop = () => {
      // Clear
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Paddle move by keys
      if (keys['ArrowLeft'] || keys['KeyA']) paddle.x -= paddle.speed;
      if (keys['ArrowRight'] || keys['KeyD']) paddle.x += paddle.speed;
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x > width - paddle.w) paddle.x = width - paddle.w;

      // Draw Paddle
      ctx.save();
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
      ctx.fill();
      ctx.restore();

      // Ball move
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Ball walls
      if (ball.x - ball.r < 0 || ball.x + ball.r > width) {
        ball.vx = -ball.vx;
        sfx.ping();
      }
      if (ball.y - ball.r < 0) {
        ball.vy = -ball.vy;
        sfx.ping();
      }

      // Ball Paddle collision
      if (
        ball.y + ball.r >= paddle.y &&
        ball.y - ball.r <= paddle.y + paddle.h &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.w
      ) {
        ball.vy = -Math.abs(ball.vy);
        // Angle variation based on where it hits paddle
        const hitPoint = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.vx = hitPoint * 5;
        sfx.ping();
      }

      // Bricks
      let remaining = 0;
      bricks.forEach((b) => {
        if (!b.alive) return;
        remaining++;

        // Collision with brick
        if (
          ball.x + ball.r > b.x &&
          ball.x - ball.r < b.x + brickW &&
          ball.y + ball.r > b.y &&
          ball.y - ball.r < b.y + brickH
        ) {
          b.alive = false;
          ball.vy = -ball.vy;
          currentScore += 200;
          setScore(currentScore);
          sfx.laser();
        }

        // Draw Brick
        ctx.save();
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, brickW, brickH, 4);
        ctx.fill();
        ctx.restore();
      });

      // Victory
      if (remaining === 0) {
        setGameState('VICTORY');
        if (onScoreAchieved) onScoreAchieved(currentScore);
        return;
      }

      // Ball bottom dead
      if (ball.y > height + 20) {
        setGameState('GAMEOVER');
        sfx.explosion();
        if (onScoreAchieved) onScoreAchieved(currentScore);
        return;
      }

      // Draw Ball
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 14px 'Outfit', sans-serif";
      ctx.fillText(`SCORE: ${currentScore}`, 20, 25);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameState]);

  return (
    <div className="relative w-full max-w-[640px] aspect-[16/10] mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      <canvas ref={canvasRef} className="w-full h-full block bg-slate-950" />

      {gameState === 'START' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10">
          <h2 className="text-2xl font-bold text-white mb-2">BRICK BREAKER DELUXE</h2>
          <p className="text-xs text-slate-300 mb-6">Move paddle with Mouse or Left/Right arrows to smash all glowing neon bricks.</p>
          <button
            onClick={() => {
              setScore(0);
              setGameState('PLAYING');
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> Play Now
          </button>
        </div>
      )}

      {(gameState === 'GAMEOVER' || gameState === 'VICTORY') && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10">
          <h2 className="text-2xl font-bold text-white mb-1">
            {gameState === 'VICTORY' ? 'STAGE CLEARED!' : 'PADDLE LOST'}
          </h2>
          <p className="text-base text-blue-400 font-semibold mb-4">Final Score: {score}</p>
          <button
            onClick={() => {
              setScore(0);
              setGameState('PLAYING');
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Restart
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. 2048 NEON FUSION BOARD
// ==========================================
const Game2048Board: React.FC<{ onScoreAchieved?: (score: number) => void }> = ({ onScoreAchieved }) => {
  const [board, setBoard] = useState<number[][]>([
    [0, 2, 0, 0],
    [0, 0, 4, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);

  const spawnTile = (curr: number[][]) => {
    const empties: { r: number; c: number }[] = [];
    curr.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === 0) empties.push({ r, c });
      });
    });
    if (empties.length === 0) return curr;
    const choice = empties[Math.floor(Math.random() * empties.length)];
    const clone = curr.map((r) => [...r]);
    clone[choice.r][choice.c] = Math.random() > 0.85 ? 4 : 2;
    return clone;
  };

  const slideRow = (row: number[]) => {
    const nonZero = row.filter((v) => v !== 0);
    let gained = 0;
    const result: number[] = [];
    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;
        result.push(merged);
        gained += merged;
        i++;
      } else {
        result.push(nonZero[i]);
      }
    }
    while (result.length < 4) result.push(0);
    return { result, gained };
  };

  const move = (direction: 'left' | 'right' | 'up' | 'down') => {
    let newBoard = board.map((r) => [...r]);
    let pointsGained = 0;

    if (direction === 'left') {
      newBoard = newBoard.map((row) => {
        const { result, gained } = slideRow(row);
        pointsGained += gained;
        return result;
      });
    } else if (direction === 'right') {
      newBoard = newBoard.map((row) => {
        const { result, gained } = slideRow([...row].reverse());
        pointsGained += gained;
        return result.reverse();
      });
    } else if (direction === 'up') {
      for (let c = 0; c < 4; c++) {
        const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
        const { result, gained } = slideRow(col);
        pointsGained += gained;
        for (let r = 0; r < 4; r++) newBoard[r][c] = result[r];
      }
    } else if (direction === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
        const { result, gained } = slideRow(col);
        pointsGained += gained;
        for (let r = 0; r < 4; r++) newBoard[3 - r][c] = result[r];
      }
    }

    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      const withSpawn = spawnTile(newBoard);
      setBoard(withSpawn);
      const nextScore = score + pointsGained;
      setScore(nextScore);
      sfx.ping();
      if (onScoreAchieved) onScoreAchieved(nextScore);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) move('left');
      if (['ArrowRight', 'KeyD'].includes(e.code)) move('right');
      if (['ArrowUp', 'KeyW'].includes(e.code)) move('up');
      if (['ArrowDown', 'KeyS'].includes(e.code)) move('down');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [board, score]);

  const tileColors: { [key: number]: string } = {
    2: 'bg-purple-950 text-purple-200 border-purple-800',
    4: 'bg-indigo-950 text-indigo-200 border-indigo-700',
    8: 'bg-blue-900 text-blue-100 border-blue-600',
    16: 'bg-cyan-900 text-cyan-100 border-cyan-500',
    32: 'bg-emerald-900 text-emerald-100 border-emerald-500',
    64: 'bg-amber-900 text-amber-100 border-amber-500',
    128: 'bg-orange-800 text-orange-100 border-orange-400 font-bold shadow-lg',
    256: 'bg-rose-800 text-rose-100 border-rose-400 font-bold shadow-lg',
    512: 'bg-pink-700 text-pink-100 border-pink-300 font-bold shadow-xl',
    1024: 'bg-purple-600 text-white border-purple-300 font-extrabold shadow-xl',
    2048: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold shadow-2xl animate-pulse',
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between w-full">
        <div>
          <h3 className="text-xl font-bold text-white">2048 NEON</h3>
          <p className="text-xs text-slate-400">Arrow keys or swipe to slide</p>
        </div>
        <div className="bg-slate-900 border border-purple-500/30 px-3 py-1.5 rounded-lg text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Score</span>
          <span className="text-lg font-bold text-purple-300 tabular-nums">{score}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-2xl">
        {board.flat().map((val, idx) => (
          <div
            key={idx}
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl border flex items-center justify-center text-xl font-bold transition-all duration-100 select-none ${
              val === 0 ? 'bg-slate-950/60 border-slate-800/40 text-transparent' : tileColors[val] || 'bg-purple-600 text-white'
            }`}
          >
            {val !== 0 && val}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setBoard(spawnTile(spawnTile([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])));
            setScore(0);
          }}
          className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Board
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 5. MEMORY MATRIX TEST
// ==========================================
const MemoryMatrixBoard: React.FC<{ onScoreAchieved?: (score: number) => void }> = ({ onScoreAchieved }) => {
  const [level, setLevel] = useState(1);
  const [activeTiles, setActiveTiles] = useState<number[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [score, setScore] = useState(0);

  const startLevel = (lvl: number) => {
    setSelectedTiles([]);
    setShowingPattern(true);
    const count = Math.min(3 + lvl, 9);
    const chosen: number[] = [];
    while (chosen.length < count) {
      const idx = Math.floor(Math.random() * 16);
      if (!chosen.includes(idx)) chosen.push(idx);
    }
    setActiveTiles(chosen);

    setTimeout(() => {
      setShowingPattern(false);
    }, 1500);
  };

  useEffect(() => {
    startLevel(1);
  }, []);

  const handleTileClick = (idx: number) => {
    if (showingPattern) return;
    if (selectedTiles.includes(idx)) return;

    const nextSelected = [...selectedTiles, idx];
    setSelectedTiles(nextSelected);

    if (!activeTiles.includes(idx)) {
      sfx.explosion();
      // Failed level
      setTimeout(() => {
        startLevel(Math.max(1, level - 1));
      }, 500);
      return;
    }

    sfx.ping();

    // Check if level finished
    if (nextSelected.length === activeTiles.length) {
      const nextScore = score + level * 250;
      setScore(nextScore);
      setLevel((prev) => prev + 1);
      if (onScoreAchieved) onScoreAchieved(nextScore);
      setTimeout(() => {
        startLevel(level + 1);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between w-full">
        <div>
          <h3 className="text-lg font-bold text-white">STELLAR MEMORY MATRIX</h3>
          <p className="text-xs text-slate-400">
            {showingPattern ? 'Memorize the glowing constellation!' : 'Replicate the exact pattern'}
          </p>
        </div>
        <div className="bg-slate-900 border border-purple-500/30 px-3 py-1.5 rounded-lg text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Level {level}</span>
          <span className="text-base font-bold text-purple-300 tabular-nums">Score: {score}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-2xl">
        {Array.from({ length: 16 }).map((_, idx) => {
          const isTarget = activeTiles.includes(idx);
          const isSelected = selectedTiles.includes(idx);
          const shouldGlow = (showingPattern && isTarget) || (isSelected && isTarget);
          const isWrong = isSelected && !isTarget;

          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              disabled={showingPattern}
              className={`w-16 h-16 rounded-xl border transition-all duration-200 select-none ${
                shouldGlow
                  ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/50 scale-95'
                  : isWrong
                  ? 'bg-rose-600 border-rose-400'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
