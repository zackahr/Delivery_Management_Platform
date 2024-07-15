import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import CSS styles for Dashboard
import { useScreenSize } from './useScreenSize';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import AddCommand from './AddCommand';
import TableCommands from './TableCommands';
import TableCommands2 from './TableCommands2';
import TableUsers from './TableUsers'; // Import TableUsers component

interface User {
  username: string;
  role: string;
}

const Dashboard2: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showAddCommand, setShowAddCommand] = useState(false);
  const [showTableCommands, setShowTableCommands] = useState(false);
  const [showTableUsers, setShowTableUsers] = useState(false); // State to manage TableUsers visibility
  const [commands, setCommands] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isPhone = useScreenSize();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchCommands();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const decodedToken: any = jwtDecode(token);
      const currentUser: User = {
        username: decodedToken.username,
        role: decodedToken.role,
      };
      setCurrentUser(currentUser);

      const response = await axios.get<User>('http://nest-mongodb:3000/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/login', { replace: true });
    }
  };

  const fetchCommands = async () => {
    try {
      const response = await axios.get('http://nest-mongodb:3000/commands/');
      setCommands(response.data);
      setShowTableCommands(true);
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
  };

  const handleShowAddCommand = () => {
    setShowAddCommand(true);
    setShowTableCommands(false);
    setShowTableUsers(false); // Ensure TableUsers is hidden when showing AddCommand
  };

  const handleShowCommands = () => {
    setShowTableCommands(true);
    setShowAddCommand(false);
    setShowTableUsers(false); // Ensure TableUsers is hidden when showing TableCommands
  };

  const handleShowUsers = () => {
    setShowTableUsers(true); // Show TableUsers when "Users" button is clicked
    setShowAddCommand(false);
    setShowTableCommands(false);
  };

  const handleHideAddCommand = () => setShowAddCommand(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    navigate('/login', { replace: true }); // Navigate to login page
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="header-title">{t('Al morakochi')}</h1>
        <div className="header-buttons">
          <div className="language-dropdown">
            <button className="header-button">{t('languages')}</button>
            <div className="language-switcher">
              <button className="lang-button" onClick={() => changeLanguage('ar')}>AR</button>
              <button className="lang-button" onClick={() => changeLanguage('en')}>EN</button>
              <button className="lang-button" onClick={() => changeLanguage('fr')}>FR</button>
            </div>
          </div>
          <button className="header-button" onClick={handleShowAddCommand}>{t('Create')}</button>
          <button className="header-button" onClick={handleShowCommands}>{t('Commands')}</button>
          {currentUser?.role === 'admin' && (
            <button className="header-button" onClick={handleShowUsers}>{t('Users')}</button>
          )}
          <button className="header-button logout-button" onClick={handleLogout}>{t('Logout')}</button>
        </div>
      </div>
      <main className="dashboard-content">
        {showAddCommand && <AddCommand />}
        {showTableCommands && (
          isPhone ? <TableCommands2 commands={commands} /> : <TableCommands commands={commands} />
        )}
        {showTableUsers && <TableUsers />}
      </main>
    </div>
  );
};

export default Dashboard2;
