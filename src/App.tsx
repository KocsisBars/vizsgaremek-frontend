import { useState } from 'react';
import Navbar from './Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Wordle from './pages/Wordle';
import Snake from './pages/Snake';
import FlappyBird from './pages/FlappyBird';
import Leaderboard from './pages/Leaderboard';
import './index.css';

type Page = 'home' | 'login' | 'register' | 'wordle' | 'snake' | 'flappybird' | 'leaderboard';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (!isLoggedIn && ['wordle', 'snake', 'flappybird', 'leaderboard'].includes(currentPage)) {
      return (
        <div className="container">
          <h1>Hozzáférés megtagadva</h1>
          <p>Be kell jelentkezni,hogy elérd ezt az oldalt</p>
          <button onClick={() => setCurrentPage('login')}>Bejelentkezéshez</button>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'register':
        return <Register onRegister={handleRegister} onNavigate={setCurrentPage} />;
      case 'wordle':
        return <Wordle />;
      case 'snake':
        return <Snake />;
      case 'flappybird':
        return <FlappyBird />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      <Navbar onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {renderPage()}
    </div>
  );
};

export default App;





