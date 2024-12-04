// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AboutUs from './Components/aboutus';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import './App.css';
import { FaUserCircle } from 'react-icons/fa'; // Import profile icon
import Profile from './Components/Profile';
import Game from './Components/Game';
import BananaChallenge from './Components/BananaChallenge'
import InstructionPage from './Components/InstructionPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Check if the user is logged in when the app loads
  useEffect(() => {
    const loggedInUser = localStorage.getItem('isLoggedIn');
    if (loggedInUser === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Single Navbar */}
        <header className="main-header">
          <nav>
            <div className="nav-container">
              <h1 className="game-name">MultiMath</h1>
              {/* Conditionally render links and profile icon based on login status */}
              {!isLoggedIn ? (
                <>
                  {/* Links before login */}
                  <Link to="/" className="nav-link-home">Home</Link>
                  <Link to="/about" className="nav-link">About Us</Link>
                </>
              ) : (
                <>
                  {/* Links after login */}
                  <Link to="/home" className="nav-link-home">Home</Link>
                  <Link to="/about" className="nav-link">About Us</Link>
                  <Link to="/profile" className="nav-link-profile">
                    <FaUserCircle className="profile-icon" /> {/* Profile Icon */}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <div className="main-container">
          <Routes>
            <Route 
              path="/" 
              element={ 
                <>
                  <h2>Welcome to MultiMath!</h2>
                  <div className="button-container">
                    <Link to="/login" className="action-button login-button">Login</Link>
                    <Link to="/register" className="action-button register-button">Register</Link>
                  </div>
                </>
              } 
            />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route 
              path="/login" 
              element={<Login setIsLoggedIn={setIsLoggedIn} />} 
            />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/start-game" element={<Game setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/banana-challenge" element={<BananaChallenge setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/instructions" element={<InstructionPage setIsLoggedIn={setIsLoggedIn} />} />
           {/* Added Profile Route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
