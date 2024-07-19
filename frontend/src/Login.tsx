import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import backgroundImage from './assets/bg.png';

const LoginContainer = styled.div<{ background: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  font-weight: 900;
  background: #00695c;
`;

const LoginBox = styled.div`
  background: #00897b;
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
    background: #5a72a0;
    color: #fff;
    border: 1px solid #fff;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const ip = import.meta.env.VITE_IP_ADDRESS;

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(`https://${ip}:3000/users/login`, {
        username,
        password,
      });

      // Assuming your backend returns a token in the response
      const token = response.data.access_token;
      console.log('Login response:', response.data); // Log the response data to verify structure
      localStorage.setItem('token', token);

      // Verify token storage
      const storedToken = localStorage.getItem('token');
      console.log('Stored token:', storedToken);

      // Navigate to home page
      navigate('/', { replace: true });
      console.log('Navigating to home page');

      // Reset state
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
        <Title>{t('Al morakochi')}</Title>
        <form onSubmit={handleLogin}>
          <InputGroup>
            <Label htmlFor="username">{t('Username')}</Label>
            <Input
              type="text"
              id="username"
              placeholder={t('Enter Username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = t('Enter Username'))}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">{t('Password')}</Label>
            <Input
              type="password"
              id="password"
              placeholder={t('Enter Password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = t('Enter Password'))}
              required
            />
          </InputGroup>
          <Button type="submit">{t('Login')}</Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
