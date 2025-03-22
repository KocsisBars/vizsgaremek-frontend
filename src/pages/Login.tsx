type LoginProps = {
  onLogin: () => void;
  onNavigate: (page: string) => void;
};

const Login = ({ onLogin, onNavigate }: LoginProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      alert("Sikeres bejelentkezés!");
      onLogin();
    } else {
      alert("Sikertelen bejelentkezés!");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={() => onNavigate("register")}>Register</button>
      </p>
    </div>
  );
};

export default Login;

