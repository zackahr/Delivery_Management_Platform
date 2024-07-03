import React from 'react';
import { useTranslation } from 'react-i18next';
import './NotFound.css'; // Optional: if you want to add custom styles

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-container">
      <h1>{t('Page Not Found')}</h1>
      <p>{t('The page you are looking for does not exist.')}</p>
      <a href="/">{t('Go to Home')}</a>
    </div>
  );
};

export default NotFound;
