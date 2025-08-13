import { useState, useEffect, useRef } from 'react';
import './XP.css';

const MiniGame = ({ onGameOver }) => { // Accept the onGameOver prop
    // Player State
    const [playerTop, setPlayerTop] = useState(250);
    const [isJumping, setIsJumping] = useState(false);
    const playerVelocityY = useRef(0);

    // Game State
    const [obstacles, setObstacles] = useState([]);
    const [gameSpeed, setGameSpeed] = useState(5);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const gameContainerRef = useRef(null);
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

    // --- Main Game Loop ---
    useEffect(() => {
        if (isGameOver) {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
            return;
        }

        gameLoopRef.current = setInterval(() => {
            frameCount.current++;

            // Player Physics
            setPlayerTop(prevPlayerTop => {
                playerVelocityY.current += GRAVITY;
                let newPlayerTop = prevPlayerTop + playerVelocityY.current;
                if (newPlayerTop >= GROUND_HEIGHT) {
                    newPlayerTop = GROUND_HEIGHT;
                    playerVelocityY.current = 0;
                    setIsJumping(false);
                }
                return newPlayerTop;
            });

            // Obstacle Logic
            setObstacles(prevObstacles => {
                const movedObstacles = prevObstacles.map(o => ({ ...o, left: o.left - gameSpeed }));
                const filteredObstacles = movedObstacles.filter(o => o.left > -OBSTACLE_WIDTH);
                const lastObstacle = filteredObstacles[filteredObstacles.length - 1];
                if (!lastObstacle || lastObstacle.left < GAME_WIDTH - 300 - Math.random() * 200) {
                    filteredObstacles.push({
                        left: GAME_WIDTH,
                        height: 50 + Math.random() * 60,
                    });
                }
                return filteredObstacles;
            });

            // Update Score & Speed
            if (frameCount.current % 10 === 0) {
                setScore(prevScore => {
                    const newScore = prevScore + 1;
                    if (newScore % 100 === 0 && newScore > 0) {
                        setGameSpeed(prevSpeed => prevSpeed + 0.5);
                    }
                    return newScore;
                });
            }
        }, 1000 / 60);

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [isGameOver, gameSpeed]);


    // --- Collision Detection ---
    useEffect(() => {
        if (isGameOver) return;

        const playerRect = {
            top: playerTop,
            left: 50,
            right: 50 + PLAYER_SIZE,
            bottom: playerTop + PLAYER_SIZE,
        };

        for (const obstacle of obstacles) {
            const obstacleRect = {
                top: GAME_HEIGHT - obstacle.height,
                left: obstacle.left,
                right: obstacle.left + OBSTACLE_WIDTH,
                bottom: GAME_HEIGHT,
            };

            if (
                playerRect.right > obstacleRect.left &&
                playerRect.left < obstacleRect.right &&
                playerRect.bottom > obstacleRect.top &&
                playerRect.top < obstacleRect.bottom
            ) {
                setIsGameOver(true);
                if (onGameOver) onGameOver(); // Call the function passed from the parent
                return;
            }
        }
    }, [playerTop, obstacles, isGameOver, onGameOver]);


    // --- Player Controls ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && !isJumping && !isGameOver) {
                setIsJumping(true);
                playerVelocityY.current = JUMP_FORCE;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isJumping, isGameOver]);

    // --- Restart Game ---
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
            <div className="speed-display">Speed: {gameSpeed.toFixed(1)}x</div>

            {isGameOver && (
                <div className="game-over-screen">
                    <h2>Game Over</h2>
                    <p>Your Score: {score}</p>
                    <button onClick={restartGame}>Restart</button>
                </div>
            )}

            <div className="player" style={{ top: `${playerTop}px` }}></div>
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
