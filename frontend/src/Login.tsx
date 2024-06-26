// src/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        username,
        password,
      });
      console.log('Login successful!', response.data);
      // Store user data in local storage or state management
      localStorage.setItem('user', JSON.stringify(response.data));
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response) {
        console.error('Request made but server responded with error:', error.response.data);
        setError('Username or Password is Incorrect');
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
        setError('No response from server');
      } else {
        console.error('Error during request setup:', error.message);
        setError('An error occurred');
      }
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='father'>
      <div className="login-container">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
