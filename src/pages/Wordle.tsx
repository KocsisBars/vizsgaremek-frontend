import { useState } from "react";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const WORD_LIST = [
  "APPLE", "GRAPE", "MANGO", "PEACH", "BERRY", "LEMON", "PLUMB", "CHESS", "BRAVE", "CRANE",
  "PLANE", "STORM", "CLOUD", "WATER", "EARTH", "STONE", "LIGHT", "NIGHT", "SWORD", "SHINE",
  "GLASS", "HOUSE", "BRICK", "CHAIR", "TABLE", "MUSIC", "PAPER", "PENCIL", "SMILE",
  "DREAM", "HEART", "WORLD", "PLANT", "RIVER", "MOUNT", "OCEAN", "STORY", "POWER", "MAGIC",
  "FAITH", "GRACE", "PEACE", "HAPPY", "LUCKY", "ANGEL", "STARS", "FLAME", "BREAD", "SUGAR",
  "HONEY", "CANDY", "BLOOM", "WINGS", "CROWN", "PRIDE", "UNITY", "TRUTH", "HONOR", "GLORY",
  "ALERT", "BEACH", "CIVIL", "DRIVE", "EAGER", "FRESH", "GIANT", "HUMAN", "INNER", "JUDGE",
  "KNIFE", "LEVEL", "MARCH", "NOBLE", "OFFER", "PRIME", "QUIET", "RAISE", "SHARP", "THINK",
  "URBAN", "VIVID", "WORTH", "YOUTH", "ZEBRA", "BLEND", "CRISP", "DEPTH", "EQUAL", "FORCE",
  "GRAND", "HAPPY", "IDEAL", "JOLLY", "KNOCK", "LARGE", "MIGHT", "NORTH", "OCEAN", "PRIZE",
  "QUEST", "RANGE", "SHAPE", "THROW", "UNDER", "VITAL", "WORRY", "YEARN", "ZONED", "BRISK",
  "CLEAN", "DAILY", "EARLY", "FAITH", "GLORY", "HONEY", "IRONY", "JUMPY", "KINKY", "LOVEL",
  "MORAL", "NURSE", "OPERA", "PLAIN", "QUIRK", "RUSTY", "SWEET", "TIGHT", "UPPER", "VAGUE",
  "WINDY", "YUMMY"
];

const Wordle = () => {
  const [solution, setSolution] = useState(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isWin, setIsWin] = useState(false);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentGuess.length === WORD_LENGTH && !gameOver) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (currentGuess.length !== WORD_LENGTH || gameOver) return;

    const newGuesses = [...guesses, currentGuess.toUpperCase()];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess.toUpperCase() === solution) {
      setGameOver(true);
      setIsWin(true);
      setScore((prev) => {
        const newScore = prev + 10; 
        updatePointsInDatabase(10);
        return newScore;
      });
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setIsWin(false);
    }
  };

  const checkWord = (guess: string, solution: string) => {
    let result = Array(WORD_LENGTH).fill("gray");
    let solutionLetters = solution.split("");
    let guessLetters = guess.split("");
    let usedPositions: boolean[] = Array(WORD_LENGTH).fill(false);

    guessLetters.forEach((letter, i) => {
      if (letter === solutionLetters[i]) {
        result[i] = "green";
        usedPositions[i] = true;
      }
    });

    guessLetters.forEach((letter, i) => {
      if (result[i] === "green") return;

      const index = solutionLetters.findIndex(
        (solLetter, j) => solLetter === letter && !usedPositions[j]
      );

      if (index !== -1) {
        result[i] = "yellow";
        usedPositions[index] = true;
      }
    });

    return result;
  };

  const restartGame = () => {
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setScore(0);
    setSolution(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Wordle</h1>
      <h2>🔥 Pontszám: {score}</h2>
      <input
        type="text"
        maxLength={WORD_LENGTH}
        value={currentGuess}
        onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
        onKeyDown={handleKeyPress}
        disabled={gameOver}
        style={{
          fontSize: "20px",
          textTransform: "uppercase",
          textAlign: "center",
          width: "120px",
          marginBottom: "10px",
        }}
      />
      <button onClick={handleSubmit} disabled={gameOver} style={{ marginLeft: "10px" }}>
        Küldés
      </button>

      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] || "";
          const colors = guess ? checkWord(guess, solution) : Array(WORD_LENGTH).fill("white");

          return (
            <div key={rowIndex} style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
              {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid gray",
                    fontSize: "20px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    backgroundColor: colors[colIndex],
                    color: colors[colIndex] === "yellow" ? "black" : colors[colIndex] === "gray" ? "black" : "white",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {guess[colIndex] || ""}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div>
          {isWin ? (
            <h2>🎉 Gratulálok! Kitaláltad a szót: {solution}</h2>
          ) : (
            <h2>💀 Játék vége! A szó: {solution}</h2>
          )}
          <button onClick={restartGame} style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
            Új Játék
          </button>
        </div>
      )}
    </div>
  );
};

export default Wordle;