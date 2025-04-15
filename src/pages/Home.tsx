const Home = () => {
  return (
    <div className="container">
      <h1 className="neon-text">Üdvözlünk a JátékBazárban! 🎮</h1>
      <p className="intro-text">
        Egy helyen minden, amit egy gamer kereshet: <strong>logika</strong>, <strong>reakcióidő</strong>, <strong>kihívás</strong>.
      </p>
      
      <p className="try-text">Próbáld ki:</p>

      <ul className="game-list">
        <li>🟩 <strong>Wordle</strong> – Találd ki a szót minél kevesebb próbálkozással</li>
        <li>🐍 <strong>Snake</strong> – Klasszikus reflex-teszt, új köntösben</li>
        <li>🐦 <strong>Flappy Bird</strong> – Kerüld az akadályokat, repülj rekordig</li>
      </ul>

      <p className="leaderboard-text">
        📊 Nézd meg a <span className="neon-text">ranglistát</span>, és derítsd ki, ki vezeti a mezőnyt!
      </p>
    </div>
  );
};

export default Home;


