import { useState } from "react";

type LoginProps = {
  onLogin: () => void;
  onNavigate: (page: string) => void;
};

const Login = ({ onLogin, onNavigate }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      alert("✅ Sikeres bejelentkezés!");
      onLogin();
    } else {
      alert("❌ Sikertelen bejelentkezés!");
    }
  };

  return (
    <div className="container">
      <h1>Bejelentkezés</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Felhasználónév" required />

        {}
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Jelszó"
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

        <button type="submit">Bejelentkezés</button>
      </form>
      <p>
        Nincs még fiókod?{" "}
        <button onClick={() => onNavigate("register")}>Regisztráció</button>
      </p>
    </div>
  );
};

export default Login;