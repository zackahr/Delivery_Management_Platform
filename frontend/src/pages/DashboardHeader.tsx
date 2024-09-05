import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './DashboardHeader.css';

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userRole = localStorage.getItem('userRole');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="dashboardheader">
      <div className="logo">{t('Al morakochi')}</div>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>
      <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
        {userRole === 'admin' && (
          <>
            <button onClick={() => navigate('/add-location-and-user')}>{t('Add User')}</button>
            <button onClick={() => navigate('/settings-global')}>{t('Settings Global')}</button>
          </>
        )}
        <button onClick={() => navigate('/dashboard')}>{t('Users')}</button>
        <button onClick={() => navigate('/add-command')}>{t('Add Command')}</button>
        <button onClick={() => navigate('/add-client')}>{t('Add Client')}</button>
        <button onClick={() => navigate('/locations')}>{t('Client')}</button>
        <button onClick={() => navigate('/daily-summary')}>{t('daily summary')}</button>
        <button onClick={() => navigate('/settings')}>{t('Settings')}</button>
        <button onClick={handleLogout}>{t('Logout')}</button>
      </nav>
    </header>
  );
};

export default DashboardHeader;
