import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import PlayerModel from "./PlayerModel";
import "./XP.css";

const MiniGame = forwardRef(({ onGameOver, onGameRestart }, ref) => {
    const [playerTop, setPlayerTop] = useState(250);
    const [isJumping, setIsJumping] = useState(false);
    const playerVelocityY = useRef(0);
    const [obstacles, setObstacles] = useState([]);
    const [gameSpeed, setGameSpeed] = useState(5);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const gameLoopRef = useRef(null);
    const GRAVITY = 0.38;
    const JUMP_FORCE = -15;
    const GROUND_HEIGHT = 225;
    const PLAYER_SIZE = 35;
    const OBSTACLE_WIDTH = 80;
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 400;

    useEffect(() => {
        const savedHighScore = localStorage.getItem("miniGameHighScore") || 0;
        setHighScore(parseInt(savedHighScore, 10));
    }, []);

    useEffect(() => {
        if (isGameOver) {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            return;
        }
        gameLoopRef.current = setInterval(() => {
            setPlayerTop((prev) => {
                playerVelocityY.current += GRAVITY;
                let newTop = prev + playerVelocityY.current;
                if (newTop >= GROUND_HEIGHT) {
                    newTop = GROUND_HEIGHT;
                    playerVelocityY.current = 0;
                    setIsJumping(false);
                }
                return newTop;
            });
            setObstacles((prev) => {
                const playerPositionX = 50;
                const updatedObstacles = prev.map((o) => {
                    const newPos = { ...o, left: o.left - gameSpeed };
                    if (!newPos.scored && newPos.left < playerPositionX && o.left >= playerPositionX) {
                        setScore(s => s + 1);
                        newPos.scored = true;
                    }
                    return newPos;
                });
                const filtered = updatedObstacles.filter((o) => o.left > -OBSTACLE_WIDTH);
                const last = filtered[filtered.length - 1];
                if (!last || last.left < GAME_WIDTH - 300 - Math.random() * 200) {
                    filtered.push({ left: GAME_WIDTH, height: 100 + Math.random() * 100, scored: false });
                }
                return filtered;
            });
        }, 1000 / 60);
        return () => clearInterval(gameLoopRef.current);
    }, [isGameOver, gameSpeed]);

    useEffect(() => {
        if (isGameOver) return;
        const playerRect = {
            top: playerTop, left: 50, right: 50 + PLAYER_SIZE, bottom: playerTop + PLAYER_SIZE,
        };
        for (const obstacle of obstacles) {
            const obstacleRect = {
                top: GAME_HEIGHT - obstacle.height, left: obstacle.left, right: obstacle.left + OBSTACLE_WIDTH, bottom: GAME_HEIGHT,
            };
            if (playerRect.right > obstacleRect.left && playerRect.left < obstacleRect.right && playerRect.bottom > obstacleRect.top && playerRect.top < obstacleRect.bottom) {
                setIsGameOver(true);
                if (score > highScore) {
                    setHighScore(score);
                    localStorage.setItem("miniGameHighScore", score);
                }
                if (onGameOver) onGameOver();
                return;
            }
        }
    }, [playerTop, obstacles, isGameOver, onGameOver, score, highScore]);
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") { e.preventDefault(); }
            if (e.code === "Space" && !isGameOver) {
                if (!isJumping) {
                    setIsJumping(true);
                    playerVelocityY.current = JUMP_FORCE;
                }
            }
            if (e.code === "Space" && isGameOver) {
                restartGame();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isJumping, isGameOver]);

    const restartGame = () => {
        setPlayerTop(GROUND_HEIGHT);
        playerVelocityY.current = 0;
        setIsJumping(false);
        setObstacles([]);
        setGameSpeed(5);
        setScore(0);
        setIsGameOver(false);

        if (onGameRestart) {
            onGameRestart();
        }
    };

    useImperativeHandle(ref, () => ({
        restart() {
            restartGame();
        }
    }));
    
    return (
        <div className="game-container" style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}>
            <div className="score-display">Score: {score}</div>
            <div className="high-score-display">High Score: {highScore}</div>
            {isGameOver && (
                <div className="game-over-screen">
                    <h2>Game Over</h2>
                    <p>Your Score: {score}</p>
                    <p className="game-over-highscore">High Score: {highScore}</p>
                    <button onClick={restartGame}>Play Again</button>
                </div>
            )}
            <div className="player-canvas-container" style={{ top: `${playerTop}px` }}>
                <Canvas camera={{ position: [0, 0.5, 3.5], fov: 60 }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[3, 3, 5]} intensity={2.5} />
                    <group scale={1.2}>
                        <PlayerModel />
                    </group>
                </Canvas>
            </div>
            {obstacles.map((obstacle, index) => (
                <div key={index} className="obstacle" style={{ left: `${obstacle.left}px`, height: `${obstacle.height}px`, bottom: `0px`}}></div>
            ))}
            <div className="ground"></div>
        </div>
    );
});

export default MiniGame;