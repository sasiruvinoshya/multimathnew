import React, { useState, useEffect } from 'react';
import './Game.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';


const sanitizeEmail = (email) => email.replace('@', '_').replace('.', '_');

const Game = () => {
  const uniqueMultiplicationAnswers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20,
    21, 24, 25, 27, 28, 30, 32, 35, 36, 40, 42, 45, 48, 49,
    54, 56, 63, 64, 72, 81,
  ];

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  const shuffledNumbers = shuffleArray([...uniqueMultiplicationAnswers]);

  const [board] = useState(shuffledNumbers);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [turn, setTurn] = useState('');
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [winner, setWinner] = useState(null);
  const [opponentEmail, setOpponentEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPlayer1(user.email);
        setTurn(user.email);
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  const addOpponent = () => {
    if (opponentEmail && opponentEmail !== player1) {
      setPlayer2(opponentEmail);
    }
  };

  const updateUserStats = async (isWin) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
  
    const db = getFirestore();
    const docRef = doc(db, 'users', user.uid); // Use user.uid instead of email
    
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // If stats document exists, update the wins and losses
        const currentStats = docSnap.data();
        const newWins = isWin ? currentStats.wins + 1 : currentStats.wins;
        const newLosses = isWin ? currentStats.losses : currentStats.losses + 1;
  
        await updateDoc(docRef, {
          wins: newWins,
          losses: newLosses,
        });
  
        console.log("Stats updated successfully!");
      } else {
        // If no stats document exists, create a new one with default values
        await setDoc(docRef, {
          wins: isWin ? 1 : 0, // If the user wins, initialize wins as 1, otherwise 0
          losses: isWin ? 0 : 1, // If the user loses, initialize losses as 1, otherwise 0
        });
  
        console.log("New stats document created!");
      }
    } catch (error) {
      console.error('Error updating user stats:', error.message);
    }
  };
  const checkWinner = (highlightedCells, playerTurn) => {
    const playerCells = highlightedCells
      .filter((cell) => cell.player === playerTurn)
      .map((cell) => cell.product);

    const gridSize = 6;
    const winLength = 4;

    const grid = Array(gridSize)
      .fill(null)
      .map((_, i) => board.slice(i * gridSize, i * gridSize + gridSize));

    const checkDirection = (startRow, startCol, rowDir, colDir) => {
      let count = 0;
      for (let i = 0; i < winLength; i++) {
        const row = startRow + i * rowDir;
        const col = startCol + i * colDir;
        if (
          row >= 0 &&
          col >= 0 &&
          row < gridSize &&
          col < gridSize &&
          playerCells.includes(grid[row][col])
        ) {
          count++;
        } else {
          break;
        }
      }
      return count === winLength;
    };

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (
          checkDirection(row, col, 0, 1) ||
          checkDirection(row, col, 1, 0) ||
          checkDirection(row, col, 1, 1) ||
          checkDirection(row, col, 1, -1)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const handlePlayerInput = (num1, num2) => {
    const product = num1 * num2;
    if (board.includes(product) && !highlightedCells.some((cell) => cell.product === product)) {
      const updatedCells = [...highlightedCells, { product, player: turn }];
      setHighlightedCells(updatedCells);

      if (checkWinner(updatedCells, turn)) {
        setWinner(turn);
        setShowModal(true);
        updateUserStats(turn, turn === player1 ? player2 : player1);
      } else {
        setTurn(turn === player1 ? player2 : player1);
      }
    }
  };

  const renderTableCell = (number) => {
    const isHighlighted = highlightedCells.find((cell) => cell.product === number);
    const cellClass = isHighlighted
      ? isHighlighted.player === player1
        ? 'highlight-player1'
        : 'highlight-player2'
      : '';

    return (
      <td key={number} className={`table-cell ${cellClass}`}>
        {number}
      </td>
    );
  };

  return (
    <>
      <h3>{winner ? `${winner} Wins!` : `${turn}'s Turn`}</h3>
      <div className="game-container">
        <div className="input-container">
          <label>Enter two numbers:</label>
          <input type="number" id="num1" min="1" max="9" />
          <span> × </span>
          <input type="number" id="num2" min="1" max="9" />
          <button
            onClick={() => {
              const num1 = parseInt(document.getElementById('num1').value);
              const num2 = parseInt(document.getElementById('num2').value);
              handlePlayerInput(num1, num2);
            }}
            disabled={!!winner}
          >
            Submit
          </button>
          <input
            type="email"
            placeholder="Opponent Email"
            value={opponentEmail}
            onChange={(e) => setOpponentEmail(e.target.value)}
          />
          <button onClick={addOpponent}>Add Opponent</button>
        </div>

        <div className="table">
          <table className="game-table">
            <tbody>
              {[...Array(6)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {board.slice(rowIndex * 6, (rowIndex + 1) * 6).map(renderTableCell)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="winner-modal">
            <div className="modal-content">
              <h2>Congratulations, {winner}!</h2>
              <p>You won the game!</p>
              <button onClick={() => navigate('/banana-challenge')}>Go to Bonus Challenge</button>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Game;
