import React from 'react';
import { useTranslation } from 'react-i18next';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onClose, onConfirm }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <p>{message}</p>
        <div className="confirmation-modal-actions">
          <button className="confirm" onClick={onConfirm}>{t('Yes')}</button>
          <button className="cancel" onClick={onClose}>{t('No')}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
