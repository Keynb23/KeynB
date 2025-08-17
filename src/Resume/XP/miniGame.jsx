import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import PlayerModel from './PlayerModel';
import './XP.css';

const MiniGame = ({ onGameOver }) => {
    // Player State
    const [playerTop, setPlayerTop] = useState(250);
    const [isJumping, setIsJumping] = useState(false);
    const playerVelocityY = useRef(0);

    // Game State
    const [obstacles, setObstacles] = useState([]);
    const [gameSpeed, setGameSpeed] = useState(5);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const gameLoopRef = useRef(null);
    const frameCount = useRef(0);

    // Constants
    const GRAVITY = 0.35;
    const JUMP_FORCE = -13.5;
    const GROUND_HEIGHT = 280;
    const PLAYER_SIZE = 40;
    const OBSTACLE_WIDTH = 30;
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 400;

    // Load high score from localStorage
    useEffect(() => {
        const savedHighScore = localStorage.getItem('miniGameHighScore') || 0;
        setHighScore(parseInt(savedHighScore, 10));
    }, []);

    // Main Game Loop
    useEffect(() => {
        if (isGameOver) {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            return;
        }
        gameLoopRef.current = setInterval(() => {
            frameCount.current++;
            // Player Physics
            setPlayerTop(prev => {
                playerVelocityY.current += GRAVITY;
                let newTop = prev + playerVelocityY.current;
                if (newTop >= GROUND_HEIGHT) {
                    newTop = GROUND_HEIGHT;
                    playerVelocityY.current = 0;
                    setIsJumping(false);
                }
                return newTop;
            });
            // Obstacle Logic
            setObstacles(prev => {
                const moved = prev.map(o => ({ ...o, left: o.left - gameSpeed }));
                const filtered = moved.filter(o => o.left > -OBSTACLE_WIDTH);
                const last = filtered[filtered.length - 1];
                if (!last || last.left < GAME_WIDTH - 300 - Math.random() * 200) {
                    filtered.push({ left: GAME_WIDTH, height: 50 + Math.random() * 60 });
                }
                return filtered;
            });
            // Update Score & Speed
            if (frameCount.current % 10 === 0) {
                setScore(prev => {
                    const newScore = prev + 1;
                    if (newScore > 0 && newScore % 100 === 0) {
                        setGameSpeed(s => s + 0.5);
                    }
                    return newScore;
                });
            }
        }, 1000 / 60);
        return () => clearInterval(gameLoopRef.current);
    }, [isGameOver, gameSpeed]);

    // Collision Detection
    useEffect(() => {
        if (isGameOver) return;
        const playerRect = { top: playerTop, left: 50, right: 50 + PLAYER_SIZE, bottom: playerTop + PLAYER_SIZE };
        for (const obstacle of obstacles) {
            const obstacleRect = { top: GAME_HEIGHT - obstacle.height, left: obstacle.left, right: obstacle.left + OBSTACLE_WIDTH, bottom: GAME_HEIGHT };
            if (playerRect.right > obstacleRect.left && playerRect.left < obstacleRect.right && playerRect.bottom > obstacleRect.top && playerRect.top < obstacleRect.bottom) {
                setIsGameOver(true);
                if (score > highScore) {
                    setHighScore(score);
                    localStorage.setItem('miniGameHighScore', score);
                }
                if (onGameOver) onGameOver();
                return;
            }
        }
    }, [playerTop, obstacles, isGameOver, onGameOver, score, highScore]);

    // Player Controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if the key is Space and the game is not over
            if (e.code === 'Space' && !isGameOver) {
                // Prevent the browser's default scroll action first
                e.preventDefault();

                // Then, check if the player can jump
                if (!isJumping) {
                    setIsJumping(true);
                    playerVelocityY.current = JUMP_FORCE;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isJumping, isGameOver]);

    // Restart Game
    const restartGame = () => {
        setPlayerTop(GROUND_HEIGHT);
        playerVelocityY.current = 0;
        setIsJumping(false);
        setObstacles([]);
        setGameSpeed(5);
        setScore(0);
        frameCount.current = 0;
        setIsGameOver(false);
    };

    return (
        <div className="game-container" style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}>
            <div className="score-display">Score: {score}</div>
            <div className="high-score-display">High Score: {highScore}</div>
            <div className="speed-display">Speed: {gameSpeed.toFixed(1)}x</div>

            {isGameOver && (
                <div className="game-over-screen">
                    <h2>Game Over</h2>
                    <p>Your Score: {score}</p>
                    <p className="game-over-highscore">High Score: {highScore}</p>
                    <button onClick={restartGame}>Play Again</button>
                </div>
            )}

            <div className="player-canvas-container" style={{ top: `${playerTop}px` }}>
                <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
                    <PlayerModel />
                </Canvas>
            </div>

            {obstacles.map((obstacle, index) => (
                <div
                    key={index}
                    className="obstacle"
                    style={{
                        left: `${obstacle.left}px`,
                        height: `${obstacle.height}px`,
                        bottom: `0px`
                    }}
                ></div>
            ))}
            <div className="ground"></div>
        </div>
    );
};

export default MiniGame;
