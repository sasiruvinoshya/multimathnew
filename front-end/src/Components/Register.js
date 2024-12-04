import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase'; 
import './Login.css'; 
import { createUserWithEmailAndPassword } from "firebase/auth"; // Assuming you have a CSS file for styling

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Use Firebase Authentication to create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      console.log('Firebase User Registered:', user);

      // After successful registration, navigate to the login page
      navigate('/login');
    } catch (firebaseError) {
      console.error('Firebase Registration Error:', firebaseError);
      setError(firebaseError.message); // Display error if any
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      <div className="register-link">
        <p>Already registered? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}

export default Register;
