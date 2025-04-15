import { useState } from "react";

type RegisterProps = {
  onNavigate: (page: string) => void;
};

const Register = ({ onNavigate }: RegisterProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("A jelszavak nem egyeznek!");
      return;
    }

    setError("");

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("✅ Sikeres regisztráció!");
      onNavigate("login");
    } else {
      alert("❌ Sikertelen regisztráció!");
    }
  };

  return (
    <div className="container">
      <h1>Regisztráció</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Felhasználónév"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {}
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Jelszó"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
        </div>

        {}
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Jelszó megerősítése"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "👁️" : "🙈"}
          </button>
        </div>

        <button type="submit">Regisztráció</button>
      </form>
      <p>
        Már van fiókod?{" "}
        <button onClick={() => onNavigate("login")}>Bejelentkezés</button>
      </p>
    </div>
  );
};

export default Register;