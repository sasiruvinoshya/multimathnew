import React, { useState, useEffect } from 'react';
import './Game.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useCallback } from 'react';

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
  const [player, setPlayer] = useState('');
  const [turn, setTurn] = useState('');
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPlayer(user.email);
        setTurn(user.email); // Start with the player's turn
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  const updateUserStats = async (isWin) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getFirestore();
    const docRef = doc(db, 'users', user.uid);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentStats = docSnap.data();
        const newWins = isWin ? currentStats.wins + 1 : currentStats.wins;
        const newLosses = isWin ? currentStats.losses : currentStats.losses + 1;

        await updateDoc(docRef, {
          wins: newWins,
          losses: newLosses,
        });

        console.log("Stats updated successfully!");
      } else {
        await setDoc(docRef, {
          wins: isWin ? 1 : 0,
          losses: isWin ? 0 : 1,
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
        updateUserStats(true); // Update stats if the player wins
      } else {
        setTurn('Computer'); // Switch to computer's turn
      }
    }
  };

  const getAdjacentCells = (product) => {
    const index = board.indexOf(product);
    const row = Math.floor(index / 6);
    const col = index % 6;
    const adjacentCells = [];

    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],  // Horizontal and vertical
      [-1, -1], [-1, 1], [1, -1], [1, 1]  // Diagonals
    ];

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 6) {
        const adjacentProduct = board[newRow * 6 + newCol];
        adjacentCells.push(adjacentProduct);
      }
    });

    return adjacentCells;
  };

  const systemMove = useCallback(() => {
    const lastPlayerMove = highlightedCells[highlightedCells.length - 1];
    const adjacentCells = getAdjacentCells(lastPlayerMove.product);
    const availableMoves = adjacentCells.filter(
      (cell) => !highlightedCells.some((highlight) => highlight.product === cell)
    );
  
    if (availableMoves.length > 0) {
      const systemChoice = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const updatedCells = [...highlightedCells, { product: systemChoice, player: 'Computer' }];
      setHighlightedCells(updatedCells);
  
      if (checkWinner(updatedCells, 'Computer')) {
        setWinner('Computer');
        setShowModal(true);
        updateUserStats(false); // Update stats if the system wins
      } else {
        setTurn(player); // Switch back to player's turn
      }
    }
  }, [highlightedCells, turn, player]);  // Add dependencies for useCallback
  
  useEffect(() => {
    if (turn === 'Computer' && !winner) {
      systemMove();  // Make the computer move
    }
  }, [turn, highlightedCells, winner, systemMove]);  // Add systemMove to dependencies

  const renderTableCell = (number) => {
    const isHighlighted = highlightedCells.find((cell) => cell.product === number);
    const cellClass = isHighlighted
      ? isHighlighted.player === player
        ? 'highlight-player'
        : 'highlight-computer'
      : '';

    return (
      <td key={number} className={`table-cell ${cellClass}`} onClick={() => {
        if (turn === player) {
          const num1 = Math.floor(number / 9) + 1;
          const num2 = number % 9 + 1;
          handlePlayerInput(num1, num2);
        }
      }}>
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
          >
            Submit
          </button>
        </div>
        <table className="multiplication-grid">
          <tbody>
            {Array.from({ length: 6 }, (_, row) => (
              <tr key={row}>
                {board.slice(row * 6, (row + 1) * 6).map(renderTableCell)}
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
    </>
  );
};

export default Game;
