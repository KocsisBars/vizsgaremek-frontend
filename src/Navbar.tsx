type NavbarProps = {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
};

const Navbar = ({ onNavigate, isLoggedIn, onLogout }: NavbarProps) => {
  return (
    <nav className="navbar">
      <h1>Game App</h1>
      <div>
        <button onClick={() => onNavigate('home')}>Home</button>
        {!isLoggedIn && <button onClick={() => onNavigate('login')}>Login</button>}
        {!isLoggedIn && <button onClick={() => onNavigate('register')}>Register</button>}
        {isLoggedIn && <button onClick={() => onNavigate('wordle')}>Wordle</button>}
        {isLoggedIn && <button onClick={() => onNavigate('snake')}>Snake</button>}
        {isLoggedIn && <button onClick={() => onNavigate('flappybird')}>FlappyBird</button>}
        {isLoggedIn && <button onClick={() => onNavigate('leaderboard')}>Leaderboard</button>}
        {isLoggedIn && <button onClick={onLogout}>Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;

  
  
