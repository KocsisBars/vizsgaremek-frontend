type RegisterProps = {
  onRegister: () => void;
  onNavigate: (page: string) => void;
};

const Register = ({ onRegister, onNavigate }: RegisterProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister();
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
        Already have an account? <button onClick={() => onNavigate('login')}>Login</button>
      </p>
    </div>
  );
};

export default Register;

