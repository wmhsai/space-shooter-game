import { useEffect, useRef, useState } from "react";

const WIDTH = 800;
const HEIGHT = 600;

type Bullet = {
  x: number;
  y: number;
  speed: number;
  radius: number;
};

type Enemy = {
  x: number;
  y: number;
  radius: number;
  speed: number;
};

type Star = {
  x: number;
  y: number;
  speed: number;
  radius: number;
};

type Game = {
  player: {
    x: number;
    y: number;
    radius: number;
    speed: number;
  };
  bullets: Bullet[];
  enemies: Enemy[];
  stars: Star[];
  keys: Set<string>;
  score: number;
  lives: number;
  spawnTimer: number;
  lastShot: number;
  paused: boolean;
  over: boolean;
};

// Create a new game
function createGame(): Game {
  return {
    player: {
      x: WIDTH / 2,
      y: HEIGHT - 70,
      radius: 20,
      speed: 350,
    },

    bullets: [],
    enemies: [],

    stars: Array.from({ length: 90 }, () => ({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      speed: 30 + Math.random() * 90,
      radius: Math.random() * 1.8 + 0.5,
    })),

    keys: new Set(),

    score: 0,
    lives: 3,
    spawnTimer: 0.5,
    lastShot: 0,

    paused: false,
    over: false,
  };
}

export default function SpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);

  if (gameRef.current === null) {
    gameRef.current = createGame();
  }

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // GAME LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let animationId = 0;
    let lastTime = 0;
    let hudTimer = 0;

    const background = ctx.createLinearGradient(0, 0, 0, HEIGHT);

    background.addColorStop(0, "#080d20");
    background.addColorStop(1, "#111b38");

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;
      if (e.code === "KeyP" && !e.repeat && !game.over) {
        game.paused = !game.paused;
        setPaused(game.paused);
        return;
      }
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          e.code,
        )
      ) {
        e.preventDefault();
      }

      game.keys.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameRef.current?.keys.delete(e.code);
    };

    const handleBlur = () => {
      gameRef.current?.keys.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    // DRAW GAME
    function draw(game: Game) {
      if (!ctx) return;

      // Background
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Stars
      game.stars.forEach((star) => {
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.3 + star.radius / 3;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // Bullets
      game.bullets.forEach((bullet) => {
        ctx.save();

        ctx.shadowBlur = 15;
        ctx.shadowColor = "#22d3ee";
        ctx.fillStyle = "#67e8f9";

        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Enemies
      game.enemies.forEach((enemy) => {
        ctx.save();

        ctx.shadowBlur = 15;
        ctx.shadowColor = "#fb7185";
        ctx.fillStyle = "#f43f5e";

        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fecdd3";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius / 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Player spaceship
      const player = game.player;

      ctx.save();
      ctx.translate(player.x, player.y);

      ctx.shadowBlur = 20;
      ctx.shadowColor = "#22d3ee";

      ctx.fillStyle = "#22d3ee";

      ctx.beginPath();
      ctx.moveTo(0, -player.radius * 1.5);
      ctx.lineTo(player.radius, player.radius);
      ctx.lineTo(0, player.radius / 2);
      ctx.lineTo(-player.radius, player.radius);
      ctx.closePath();
      ctx.fill();

      // Ship center
      ctx.fillStyle = "#e0f2fe";

      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      // Engine flame
      ctx.shadowColor = "#f97316";
      ctx.fillStyle = "#f97316";

      ctx.beginPath();
      ctx.moveTo(-6, player.radius);
      ctx.lineTo(0, player.radius + 15 + Math.random() * 8);
      ctx.lineTo(6, player.radius);
      ctx.fill();

      ctx.restore();

      // Pause / Game Over overlay
      if (game.paused || game.over) {
        ctx.fillStyle = "rgba(3, 7, 18, 0.75)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 44px Arial";

        ctx.fillText(game.over ? "GAME OVER" : "PAUSED", WIDTH / 2, HEIGHT / 2);

        ctx.font = "18px Arial";
        ctx.fillStyle = "#94a3b8";

        ctx.fillText(
          game.over
            ? "Click Restart to play again"
            : "Click Resume to continue",
          WIDTH / 2,
          HEIGHT / 2 + 40,
        );
      }
    }

    // UPDATE GAME
    function update(game: Game, dt: number, time: number) {
      if (game.paused || game.over) return;

      const player = game.player;
      const keys = game.keys;

      // Player movement
      if (keys.has("ArrowLeft") || keys.has("KeyA")) {
        player.x -= player.speed * dt;
      }

      if (keys.has("ArrowRight") || keys.has("KeyD")) {
        player.x += player.speed * dt;
      }

      if (keys.has("ArrowUp") || keys.has("KeyW")) {
        player.y -= player.speed * dt;
      }

      if (keys.has("ArrowDown") || keys.has("KeyS")) {
        player.y += player.speed * dt;
      }

      // Keep player inside canvas
      player.x = Math.max(
        player.radius,
        Math.min(WIDTH - player.radius, player.x),
      );

      player.y = Math.max(
        player.radius * 2,
        Math.min(HEIGHT - player.radius, player.y),
      );

      // Shooting
      if (keys.has("Space") && time - game.lastShot > 220) {
        game.bullets.push({
          x: player.x,
          y: player.y - 20,
          speed: 600,
          radius: 4,
        });

        game.lastShot = time;
      }

      // Move bullets
      game.bullets.forEach((bullet) => {
        bullet.y -= bullet.speed * dt;
      });

      game.bullets = game.bullets.filter((bullet) => bullet.y > -20);

      // Move stars
      game.stars.forEach((star) => {
        star.y += star.speed * dt;

        if (star.y > HEIGHT) {
          star.y = 0;
          star.x = Math.random() * WIDTH;
        }
      });

      // Spawn enemies
      game.spawnTimer -= dt;

      if (game.spawnTimer <= 0) {
        game.enemies.push({
          x: 30 + Math.random() * (WIDTH - 60),
          y: -30,
          radius: 15 + Math.random() * 10,
          speed: 100 + Math.random() * 70 + game.score * 0.03,
        });

        game.spawnTimer = Math.max(0.35, 0.9 - game.score / 1000);
      }

      // Move enemies
      game.enemies.forEach((enemy) => {
        enemy.y += enemy.speed * dt;
      });

      // Bullet / Enemy collision
      for (let ei = game.enemies.length - 1; ei >= 0; ei--) {
        const enemy = game.enemies[ei];
        let destroyed = false;

        for (let bi = game.bullets.length - 1; bi >= 0; bi--) {
          const bullet = game.bullets[bi];

          const distance = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);

          if (distance < enemy.radius + bullet.radius) {
            game.bullets.splice(bi, 1);
            game.enemies.splice(ei, 1);

            game.score += 10;
            destroyed = true;
            break;
          }
        }

        if (destroyed) continue;

        // Enemy / Player collision
        const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);

        if (distance < enemy.radius + player.radius * 0.7) {
          game.enemies.splice(ei, 1);
          game.lives--;
        } else if (enemy.y - enemy.radius > HEIGHT) {
          game.enemies.splice(ei, 1);
          game.lives--;
        }

        if (game.lives <= 0) {
          game.lives = 0;
          game.over = true;
        }
      }
    }

    // ANIMATION FRAME
    function loop(time: number) {
      const game = gameRef.current;

      if (!game) return;

      if (lastTime === 0) lastTime = time;

      const dt = Math.min((time - lastTime) / 1000, 0.04);

      lastTime = time;

      update(game, dt, time);

      hudTimer += dt;

      if (hudTimer >= 0.1 || game.over) {
        setScore(game.score);
        setLives(game.lives);

        if (game.over) {
          setGameOver(true);
        }

        hudTimer = 0;
      }

      draw(game);

      animationId = requestAnimationFrame(loop);
    }

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("keyup", handleKeyUp);

      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Pause / Resume
  const togglePause = () => {
    const game = gameRef.current;

    if (!game || game.over) return;

    game.paused = !game.paused;
    setPaused(game.paused);
  };

  // Restart
  const restartGame = () => {
    gameRef.current = createGame();

    setScore(0);
    setLives(3);
    setPaused(false);
    setGameOver(false);
  };

  return (
    <main className="game-page">
      <header className="game-header">
        <div>
          <p className="eyebrow">ARCADE / 001</p>
          <h1>SPACE SHOOTER</h1>
          <p className="subtitle">Defend the galaxy. Survive the invasion.</p>
        </div>

        <div className="game-stats">
          <div className="stat">
            <span>SCORE</span>
            <strong>{score.toString().padStart(4, "0")}</strong>
          </div>

          <div className="stat">
            <span>LIVES</span>
            <strong>{"♥ ".repeat(lives)}</strong>
          </div>
        </div>
      </header>

      <section className="game-container">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="game-canvas"
        />

        <div className="game-controls">
          <button onClick={togglePause} disabled={gameOver}>
            {paused ? "Resume" : "Pause"}
          </button>

          <button onClick={restartGame} className="restart">
            Restart
          </button>
        </div>
      </section>

      <footer className="instructions">
        <span>← ↑ ↓ → / WASD : MOVE</span>
        <span>SPACE : SHOOT</span>
        <span>P : PROTECT THE GALAXY</span>
      </footer>
    </main>
  );
}
