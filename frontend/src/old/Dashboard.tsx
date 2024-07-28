import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import CSS styles for Dashboard
import { useScreenSize } from './useScreenSize';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddCommand from './AddCommand';
import TableCommands from './TableCommands';
import TableCommands2 from './TableCommands2';
import TableUsers from './TableUsers'; // Import TableUsers component

interface User {
  username: string;
  role: string;
}

const ip = import.meta.env.VITE_IP_ADDRESS;

const Dashboard2: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showAddCommand, setShowAddCommand] = useState(false);
  const [showTableCommands, setShowTableCommands] = useState(false);
  const [showTableUsers, setShowTableUsers] = useState(false); // State to manage TableUsers visibility
  const [commands, setCommands] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isPhone = useScreenSize();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`https://${ip}/api/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setCurrentUser(response.data);
      // Determine initial state based on user role
      if (response.data.role === 'admin') {
        setShowTableCommands(true); // Admins will see the commands table by default
      } else {
        setShowAddCommand(true); // Non-admins will see the Create section by default
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/login', { replace: true });
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    try {
      const response = await axios.get(`https://${ip}/api/commands/`);
      setCommands(response.data);
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
    if (currentUser?.role === 'admin') {
      setShowTableCommands(true);
    }
    setShowAddCommand(false);
    setShowTableUsers(false);
  };

  const handleShowUsers = () => {
    if (currentUser?.role === 'admin') {
      setShowTableUsers(true); // Show TableUsers when "Users" button is clicked
    }
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
          {currentUser?.role === 'admin' && (
            <>
              <button className="header-button" onClick={handleShowCommands}>{t('Commands')}</button>
              <button className="header-button" onClick={handleShowUsers}>{t('Users')}</button>
            </>
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

