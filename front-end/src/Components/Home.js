import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page-container">
      <h2 className="home-page-heading">Welcome to MultiMath!</h2>

      <div className="home-button-container">
        <Link to="/instructions" className="home-action-button home-yellow-button">
          Instructions
        </Link>
        <Link to="/start-game" className="home-action-button home-green-button">
          Start Game
        </Link>
      </div>
    </div>
  );
}

export default Home;
