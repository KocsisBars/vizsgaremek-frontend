type RegisterProps = {
  onRegister: () => void;
  onNavigate: (page: string) => void;
};

const Register = ({ onRegister, onNavigate }: RegisterProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      alert("Sikeres regisztráció!");
      onRegister();
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <button onClick={() => onNavigate("login")}>Login</button>
      </p>
    </div>
  );
};

export default Register;

