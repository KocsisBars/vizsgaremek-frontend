import { useState, useEffect, useRef } from "react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;

const FlappyBird = () => {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ x: GAME_WIDTH, height: 200 }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef<HTMLDivElement | null>(null);

  const updatePointsInDatabase = async (pointsToAdd: number) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("A felhasználó nincs hitelesítve. Átirányítás a bejelentkezéshez...");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:3000/users/add-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: parseInt(userId, 10), pointsToAdd }),
      });

      if (!response.ok) {
        throw new Error("Nem sikerült a pontokat hozzáadni az adatbázishoz.");
      }
    } catch (error) {
      console.error("Hiba a pontok hozzáadásakor:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && !gameOver) {
        setVelocity(JUMP_STRENGTH);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setBirdY((prev) => prev + velocity);
      setVelocity((prev) => prev + GRAVITY);

      setPipes((prevPipes) => {
        return prevPipes
          .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter((pipe) => pipe.x + PIPE_WIDTH > 0)
          .concat(
            prevPipes[prevPipes.length - 1].x < GAME_WIDTH / 2
              ? [{ x: GAME_WIDTH, height: Math.random() * (GAME_HEIGHT - PIPE_GAP - 50) + 50 }]
              : []
          );
      });

      checkCollision();
    }, 30);

    return () => clearInterval(gameLoop);
  }, [birdY, velocity, pipes, gameOver]);

  const checkCollision = () => {
    if (birdY + BIRD_HEIGHT > GAME_HEIGHT || birdY < 0) {
      setGameOver(true);
    }

    pipes.forEach((pipe) => {
      if (
        pipe.x < 50 + BIRD_WIDTH &&
        50 < pipe.x + PIPE_WIDTH &&
        (birdY < pipe.height || birdY + BIRD_HEIGHT > pipe.height + PIPE_GAP)
      ) {
        setGameOver(true);
      }

      if (pipe.x === 50) {
        setScore((prev) => {
          const newScore = prev + 1;
          updatePointsInDatabase(1);
          return newScore;
        });
      }
    });
  };

  const restartGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setVelocity(0);
    setPipes([{ x: GAME_WIDTH, height: 200 }]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Flappy Bird</h1>
      <h2>🔥 Pontszám: {score}</h2>

      <div
        ref={gameRef}
        style={{
          position: "relative",
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
          backgroundColor: "skyblue",
          margin: "auto",
          overflow: "hidden",
          border: "3px solid black",
        }}
      >
        {}
        <img
          src="/bird.png"
          alt="Bird"
          style={{
            position: "absolute",
            width: `${BIRD_WIDTH}px`,
            height: `${BIRD_HEIGHT}px`,
            left: "50px",
            top: `${birdY}px`,
            transform: `rotate(${velocity * 3}deg)`,
          }}
        />

        {}
        {pipes.map((pipe, index) => (
          <div key={index}>
            {}
            <div
              style={{
                position: "absolute",
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.height}px`,
                left: `${pipe.x}px`,
                backgroundColor: "green",
              }}
            ></div>
            {}
            <div
              style={{
                position: "absolute",
                width: `${PIPE_WIDTH}px`,
                height: `${GAME_HEIGHT - pipe.height - PIPE_GAP}px`,
                left: `${pipe.x}px`,
                top: `${pipe.height + PIPE_GAP}px`,
                backgroundColor: "green",
              }}
            ></div>
          </div>
        ))}
      </div>

      {gameOver && <h2>💀 Játék vége! Próbáld újra!</h2>}
      {gameOver && <button onClick={restartGame} style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>Új Játék</button>}
    </div>
  );
};

export default FlappyBird;