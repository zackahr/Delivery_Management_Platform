import React, { useState, useEffect } from 'react';
import AddCommand from './AddCommand';
import TableCommands from './TableCommands';
import TableCommands2 from './TableCommands2';
import axios from 'axios';
import './Dashboard.css';
import { useScreenSize } from './useScreenSize';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard2: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [showAddCommand, setShowAddCommand] = useState(false);
    const [showTableCommands, setShowTableCommands] = useState(false);
    const [commands, setCommands] = useState([]);
    const isPhone = useScreenSize();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCommands();
    }, []);

    const fetchCommands = async () => {
        try {
            const response = await axios.get('http://localhost:3000/commands/');
            setCommands(response.data);
            setShowTableCommands(true);
        } catch (error) {
            console.error('Error fetching commands:', error);
        }
    };

    const handleShowAddCommand = () => {
        setShowAddCommand(true);
        setShowTableCommands(false);
    };

    const handleShowCommands = () => {
        setShowTableCommands(true);
        setShowAddCommand(false);
    };

    const handleHideAddCommand = () => setShowAddCommand(false);

    const handleAddCommand = (command: { clientOwner: string; productName: string; quantity: number }) => {
        console.log('Command added:', command);
        handleHideAddCommand();
        fetchCommands();
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
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
                            <button className="lang-button" onClick={() => changeLanguage('en')}>EN</button>
                            <button className="lang-button" onClick={() => changeLanguage('fr')}>FR</button>
                        </div>
                    </div>
                    <button className="header-button" onClick={handleShowAddCommand}>{t('Create')}</button>
                    <button className="header-button" onClick={handleShowCommands}>{t('Commands')}</button>
                    <button className="header-button logout-button" onClick={handleLogout}>{t('Logout')}</button>
                </div>
            </div>
            <main className="dashboard-content">
                {showAddCommand && <AddCommand onAddCommand={handleAddCommand} />}
                {showTableCommands && (
                    isPhone ? <TableCommands2 commands={commands} /> : <TableCommands commands={commands} />
                )}
            </main>
        </div>
    );
};

export default Dashboard2;
