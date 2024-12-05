import React, { useState, useEffect } from 'react';
import './Profile.css';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState({ wins: 0, losses: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const db = getFirestore();

  // Fetch user stats from Firestore using the user's UID
  const fetchStats = async (userUid) => {
    try {
      const docRef = doc(db, 'users', userUid); // Use UID instead of email for document reference
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats({
          wins: data.wins || 0,
          losses: data.losses || 0,
        });
      } else {
        console.log('No stats found for user');
        setStats({ wins: 0, losses: 0 });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error.message);
    }
    setLoading(false); // Stop loading when stats are fetched
  };

  // Update stats after the game ends (win/loss logic)
  const updateStats = async (userUid, isWin) => {
    try {
      const docRef = doc(db, 'users', userUid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedWins = isWin ? data.wins + 1 : data.wins;
        const updatedLosses = !isWin ? data.losses + 1 : data.losses;

        await setDoc(docRef, {
          wins: updatedWins,
          losses: updatedLosses,
        });

        setStats({
          wins: updatedWins,
          losses: updatedLosses,
        });
      }
    } catch (error) {
      console.error('Error updating user stats:', error.message);
    }
  };

  // Fetch opponent stats (use case if you need to display both users' stats)
  const fetchOpponentStats = async (opponentUid) => {
    try {
      const docRef = doc(db, 'users', opponentUid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Assuming the opponent's stats are also displayed
        console.log('Opponent Stats:', data);
      } else {
        console.log('No stats found for opponent');
      }
    } catch (error) {
      console.error('Error fetching opponent stats:', error.message);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setEmail(user.email); // Set email to show on profile
      fetchStats(user.uid); // Fetch stats using UID

      // For opponent stats, assuming opponentUid is passed
      const opponentUid = 'OPPONENT_UID'; // Replace with actual opponent UID
      fetchOpponentStats(opponentUid);
    } else {
      navigate('/login'); // Redirect to login if no user is logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate('/login'); // Redirect to login after logout
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  const handleGameResult = (isWin) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      updateStats(user.uid, isWin); // Update current user stats
      // Assuming you also want to update opponent stats, you should call updateStats for them as well
      const opponentUid = 'OPPONENT_UID'; // Replace with actual opponent UID
      updateStats(opponentUid, !isWin); // Update opponent's stats (they lose)
    }
  };

  if (loading) {
    return <p>Loading stats...</p>;
  }

  return (
    <div className="profile-container">
  <h1 className="profile-heading">Profile</h1>
  <p className="profile-info">
    <strong>Email:</strong> {email}
  </p>
  <p className="profile-info">
    <strong>Wins:</strong> {stats.wins}
  </p>
  <p className="profile-info">
    <strong>Losses:</strong> {stats.losses}
  </p>
  <button className="profile-logout-button" onClick={handleLogout}>
    Logout
  </button>
</div>

  );
};

export default Profile;
