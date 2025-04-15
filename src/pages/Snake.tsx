import { useState, useEffect } from "react";

const GRID_SIZE = 10;
const CELL_SIZE = 30;
const INITIAL_SNAKE = [{ x: 5, y: 5 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const Snake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);

  const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

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

  const handleEatFood = () => {
    setScore((prev) => {
      const newScore = prev + 1;
      updatePointsInDatabase(1);
      return newScore;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyDirectionMap: { [key: string]: { x: number; y: number } } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };

      if (keyDirectionMap[e.key]) {
        const newDirection = keyDirectionMap[e.key];

        if (newDirection.x !== -direction.x || newDirection.y !== -direction.y) {
          setNextDirection(newDirection);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const gameInterval = setInterval(() => {
      setDirection(nextDirection);
      moveSnake();
    }, 130);

    return () => clearInterval(gameInterval);
  }, [snake, gameOver, nextDirection]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const newHead = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (
      newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE ||
      newSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      handleEatFood();
      const newFoodPosition = generateFoodPosition(newSnake);
      if (newFoodPosition) {
        setFood(newFoodPosition);
      } else {
        setGameWon(true);
        setGameOver(true);
      }
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);

    if (newSnake.length === TOTAL_CELLS) {
      setGameWon(true);
      setGameOver(true);
    }
  };

  const generateFoodPosition = (snakeBody: { x: number; y: number }[]) => {
    const maxAttempts = 100;
    let attempts = 0;
    let newFood;
  
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      attempts++;
    } while (
      snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
      attempts < maxAttempts
    );
  
    if (attempts === maxAttempts) {
      console.warn("Nem sikerült érvényes ételpozíciót találni.");
      return null;
    }
  
    return newFood;
  };

  const resetGame = () => {
    setSnake([{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }]);
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Snake</h1>
      <h2>🔥 Pontszám: {score}</h2>
      
      <div style={{
        position: "relative",
        width: `${GRID_SIZE * CELL_SIZE}px`,
        height: `${GRID_SIZE * CELL_SIZE}px`,
        margin: "auto",
      }}>
        {}
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              style={{
                position: "absolute",
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
                left: `${col * CELL_SIZE}px`,
                top: `${row * CELL_SIZE}px`,
                backgroundColor: (row + col) % 2 === 0 ? "#a2d149" : "#aad751",
              }}
            />
          ))
        )}

        {}
        {snake.map((segment, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            backgroundColor: "#2024c1",
            left: `${segment.x * CELL_SIZE}px`,
            top: `${segment.y * CELL_SIZE}px`,
            borderRadius: "4px"
          }} />
        ))}

        {}
        <img
          src="/apple.png"
          alt="Apple"
          style={{
            position: "absolute",
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
          }}
        />
      </div>

      {gameOver && !gameWon && <h2>💀 Játék vége! Próbáld újra!</h2>}
      {gameOver && gameWon && <h2>🎉 Gratulálok! Megnyerted a játékot!</h2>}
      {gameOver && <button onClick={resetGame} style={{ marginTop: "10px", padding: "5px 10px", fontSize: "16px" }}>Új Játék</button>}
    </div>
  );
};

export default Snake;