import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './assets/bg.png';

const LoginContainer = styled.div<{ background: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  font-weight: 900;
  background: #00695C;
  // background: url(${props => props.background}) no-repeat center center/cover;
`;

const LoginBox = styled.div`
  background: #00897B;
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 1);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: white;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: white;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.8);
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #5A72A0;
    color: #fff;
    border: 1px solid #fff;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = JSON.parse(localStorage.getItem('user') || 'null');
    if (isAuth) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        username,
        password
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/', { replace: true });
      setUsername('');
      setPassword('');
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'An error occurred');
      } else {
        setError('An error occurred');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <LoginContainer background={backgroundImage}>
      <LoginBox>
        <Title>Al Morakochi</Title>
        <form onSubmit={handleLogin}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = 'Enter your username'}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = 'Enter your password'}
              required
            />
          </InputGroup>
          <Button type="submit">Login</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
