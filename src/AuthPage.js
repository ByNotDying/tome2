import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Navbar from './Navbar';
import "./AuthPage.css";

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to the home page after successful signup
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Navigate to the home page after successful login
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="page-content">
        <div className="background-container">
        </div>
        <div className="main-content">
          
          <form className="auth-form">
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button onClick={handleLogin}>Login</button>
              <button onClick={handleSignUp}>Signup</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
