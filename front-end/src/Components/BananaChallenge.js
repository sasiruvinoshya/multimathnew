import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BananaChallenge.css'; // Assuming you have a CSS file for styling

const BananaChallenge = () => {
  const [image, setImage] = useState(null);       // To store the image URL from the API
  const [solution, setSolution] = useState(null); // To store the solution from the API
  const [guess, setGuess] = useState('');         // To store the player's guess
  const [ feedback, setFeedback] = useState('');   // To store feedback for the player
  const [showModal, setShowModal] = useState(false);  // Modal visibility
  const [isWinner, setIsWinner] = useState(false);    // Winner status

  // Fetch data from the Banana API when the component loads
  useEffect(() => {
    const fetchBananaChallenge = async () => {
      try {
        const response = await axios.get('http://localhost:5000/banana-challenge');
        // Assuming the API returns an object with a "question" (image URL) and a "solution"
        setImage(response.data.question); // Set the image URL
        setSolution(response.data.solution); // Set the correct solution
      } catch (error) {
        console.error('Error fetching Banana Challenge:', error);
      }
    };

    fetchBananaChallenge();
  }, []);

  // Handle the player's guess
  const handleGuessSubmit = () => {
    if (parseInt(guess) === solution) {
      setFeedback('Correct! You solved the challenge!');
      setIsWinner(true);
    } else {
      setFeedback('Incorrect. Try again!');
      setIsWinner(false);
    }
    setShowModal(true);
  };

  // Close modal and reset the feedback
  const handleCloseModal = () => {
    setShowModal(false);
    setFeedback('');
  };

  return (
    <div className="banana-challenge-container">
      <h1>Bonus Challenge</h1>

      {image ? (
        <div className="challenge-layout">
          <img src={image} alt="Banana Challenge" className="challenge-image" />

          <div className="guess-container">
            <p className="guess-text">Can you solve the challenge based on the image?</p>
            <input
              type="number"
              placeholder="Enter your guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="guess-input"
            />
            <button onClick={handleGuessSubmit} className="submit-button">Submit Guess</button>
          </div>
        </div>
      ) : (
        <p>Loading challenge...</p>
      )}

      {/* Pop-up Modal */}
      {showModal && (
        <div className="winner-modal">
          <div className="banana-modal-content">
            {isWinner ? (
              <>
                <h2>Congratulations! You won!</h2>
                <button className="modal-button" onClick={() => window.location.href = '/home'}>Back to Home</button>
              </>
            ) : (
              <>
                <h2>Incorrect!</h2>
                <button className="modal-button" onClick={handleCloseModal}>Try Again</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BananaChallenge;
