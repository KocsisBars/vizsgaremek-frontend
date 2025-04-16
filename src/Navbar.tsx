type NavbarProps = {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
};

const Navbar = ({ onNavigate, isLoggedIn, onLogout }: NavbarProps) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/gamelogo.png" alt="Game Logo" className="game-logo" />
        <h1>JátékBazár</h1>
      </div>
      <div className="navbar-right">
        <button onClick={() => onNavigate('home')}>Home</button>
        {!isLoggedIn && <button onClick={() => onNavigate('login')}>Bejelentkezés</button>}
        {!isLoggedIn && <button onClick={() => onNavigate('register')}>Regisztráció</button>}
        {isLoggedIn && <button onClick={() => onNavigate('wordle')}>Wordle</button>}
        {isLoggedIn && <button onClick={() => onNavigate('snake')}>Snake</button>}
        {isLoggedIn && <button onClick={() => onNavigate('flappybird')}>FlappyBird</button>}
        {isLoggedIn && <button onClick={() => onNavigate('leaderboard')}>Ranglista</button>}
        {isLoggedIn && <button onClick={onLogout}>Kijelentkezés</button>}
      </div>
    </nav>
  );
};

export default Navbar;



