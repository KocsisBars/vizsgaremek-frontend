type LoginProps = {
  onLogin: () => void;
  onNavigate: (page: string) => void;
};

const Login = ({ onLogin, onNavigate }: LoginProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
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
        Don't have an account? <button onClick={() => onNavigate('register')}>Register</button>
      </p>
    </div>
  );
};

export default Login;

