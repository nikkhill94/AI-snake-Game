import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INC = 2;
const MIN_SPEED = 60;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // Moving UP

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  // References used within the interval to avoid dependency changes
  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const snakeRef = useRef<Point[]>(INITIAL_SNAKE);
  const gamePausedRef = useRef(false);
  const gameOverRef = useRef(false);
  const speedRef = useRef(INITIAL_SPEED);

  useEffect(() => {
    snakeRef.current = snake;
    gamePausedRef.current = isPaused;
    gameOverRef.current = gameOver;
  }, [snake, isPaused, gameOver]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        if (!gameOverRef.current) {
          setIsPaused((p) => !p);
        }
        return;
      }

      if (gameOverRef.current || gamePausedRef.current) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isValid = false;
    while (!isValid) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Make sure food doesn't spawn on snake
      isValid = !currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    }
    setFood(newFood!);
  }, []);

  // Main Game Loop using recursive setTimeout for variable speed
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const gameTick = () => {
      if (gameOverRef.current || gamePausedRef.current) {
        timerId = setTimeout(gameTick, speedRef.current);
        return;
      }

      const currentSnake = snakeRef.current;
      const head = currentSnake[0];
      const dir = directionRef.current;

      const newHead = {
        x: head.x + dir.x,
        y: head.y + dir.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Check self collision
      if (currentSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          // Increase speed slightly
          speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INC);
          return newScore;
        });
        spawnFood(newSnake);
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      setSnake(newSnake);
      timerId = setTimeout(gameTick, speedRef.current);
    };

    timerId = setTimeout(gameTick, speedRef.current);

    return () => clearTimeout(timerId);
  }, [food, spawnFood]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    speedRef.current = INITIAL_SPEED;
    spawnFood(INITIAL_SNAKE);
  };

  return (
    <div className="w-full flex flex-col items-center font-mono">
      <div className="w-full flex justify-between items-end mb-4 bg-black border-2 border-cyan-500 p-3 shadow-[4px_4px_0px_#06b6d4]">
        <div className="flex flex-col">
          <span className="text-fuchsia-500 text-xs font-black uppercase tracking-widest">
            VITAL.METRICS [SCORE]
          </span>
          <span className="text-cyan-400 text-4xl font-black drop-shadow-[0_0_5px_cyan] glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex gap-4">
           <button
            onClick={() => {
              if(!gameOver) setIsPaused(!isPaused)
            }}
            className="text-white hover:bg-cyan-500 hover:text-black border-2 border-cyan-500 px-3 py-1 transition-none text-xs uppercase tracking-widest font-bold"
          >
            {isPaused ? 'RESUME_OP' : 'HALT_OP'}
          </button>
          <button
            onClick={resetGame}
            className="text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black border-2 border-fuchsia-500 px-3 py-1 transition-none flex items-center gap-2 text-xs uppercase tracking-widest font-bold"
          >
            <RefreshCcw className="w-3 h-3" />
            RESTART_SEQ
          </button>
        </div>
      </div>

      <div className="relative bg-black border-[4px] border-fuchsia-500 shadow-[8px_8px_0px_#06b6d4] p-[2px]">
        {/* Glitch Overlay Effect Container */}
        <div className="absolute inset-0 pointer-events-none border-2 border-cyan-400/20 z-0" />
        
        {/* Game Grid Container */}
        <div 
          className="grid gap-px bg-zinc-900"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: '400px',
            height: '400px',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`
                  w-full h-full
                  ${isHead ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4] z-10' : ''}
                  ${!isHead && isSnake ? 'bg-cyan-600/90' : ''}
                  ${isFood ? 'bg-fuchsia-500 shadow-[0_0_12px_#d946ef] animate-[pulse_0.5s_infinite] z-10' : ''}
                  ${!isSnake && !isFood ? 'bg-black/50' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center flex-col border-[4px] border-red-500 z-20 screen-tear">
            <h2 className="text-4xl font-black text-red-500 mb-2 drop-shadow-[2px_2px_0px_white] tracking-[0.2em] uppercase glitch-text" data-text="FATAL_ERROR">
              FATAL_ERROR
            </h2>
            <p className="text-fuchsia-400 mb-6 bg-black border border-fuchsia-500 px-4 py-2 text-sm tracking-widest font-bold shadow-[2px_2px_0px_#d946ef]">
              FINAL SCORE: <span className="text-white">{score}</span>
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-red-600 border-[3px] border-white text-white font-bold hover:bg-white hover:text-red-600 uppercase tracking-widest select-none active:scale-95"
            >
              INITIATE_REBOOT
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center border-[4px] border-yellow-400 z-20">
             <div className="bg-yellow-400 text-black px-6 py-2">
                 <h2 className="text-3xl font-black tracking-[0.3em] uppercase glitch-text" data-text="SYSTEM_PAUSED">
                  SYSTEM_PAUSED
                </h2>
             </div>
          </div>
        )}
      </div>
      <div className="mt-6 w-full max-w-[400px]">
        <div className="bg-zinc-900 border-l-4 border-cyan-500 p-3 flex justify-between items-center text-xs text-cyan-400 uppercase tracking-wider shadow-[4px_4px_0px_#d946ef]">
          <span>[W,A,S,D] OR [ARROWS] : DIRECT_ENTITY</span>
          <span>[SPACE] : HALT_SEQ</span>
        </div>
      </div>
    </div>
  );
}
