import React from 'react';
import './InstructionPage.css';

const InstructionPage = () => {
  return (
    <div className="instruction-container">
      <h2 className='ins-head'>How to Play MultiMath</h2>
      
      <div className="instructions-content">
       
        <ol className="instruction-steps">
    
  <li>You will take turns with the computer to enter two numbers between 1 and 9 in the provided input fields.</li>
  <li>The product of these two numbers will be highlighted on the 6x6 grid.</li>
  <li>The grid contains all unique products of numbers from 1x1 to 9x9.</li>
  <li>Your goal is to highlight 4 numbers in a row, column, or diagonal before the computer does.</li>
  <li>Your selections will be highlighted in <span className="color-blue">blue</span>, while the computer's selections will be highlighted in <span className="color-orange">orange</span>.</li>
  <li>The first to align four consecutive numbers wins the game!</li>

        </ol>

        <div className="instructions-footer">
          <p>Good luck and may the best mathematician win!</p>
          <button className="start-button" onClick={() => window.location.href = '/start-game'}>Start Game</button>
        </div>
      </div>
    </div>
  );
};

export default InstructionPage;
