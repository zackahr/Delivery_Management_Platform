import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import CSS file
import eggs from './assets/eggs.jpg'

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/users/login',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Ensure correct content type
          },
        }
      );
      console.log('Login successful!', response.data);
      // Redirect or perform actions upon successful login
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Request made but server responded with error:', error.response.data);
          setError(error.response.data.message); // Handle backend-specific error messages
        } else if (error.request) {
          console.error('Request made but no response received:', error.request);
          setError('No response received from server. Please try again.');
        } else {
          console.error('Error during request setup:', error.message);
          setError('Error during request setup. Please try again.');
        }
      } else {
        console.error('Non-Axios error occurred:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

return (
  <div className='father'>
    <div className='login-container'>
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
