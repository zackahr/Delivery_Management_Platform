import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface Client {
  _id: string;
  name: string;
  phone: string;
  balance: number;
}

interface ClientModalProps {
  client: Client;
  onClose: () => void;
  refreshClients: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ client, onClose, refreshClients }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  const [name, setName] = useState<string>(client.name);
  const [phone, setPhone] = useState<string>(client.phone);
  const [balance, setBalance] = useState<number>(client.balance);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://${import.meta.env.VITE_IP_ADDRESS}/api/client/${client._id}`, {
        name,
        phone,
        balance,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshClients();
      onClose();
    } catch (error) {
      setError(t('Error updating client')); // Use translation for error message
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://${import.meta.env.VITE_IP_ADDRESS}/api/client/${client._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshClients();
      onClose();
    } catch (error) {
      setError(t('Error deleting client')); // Use translation for error message
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>{t('Edit Client')}</h2> {/* Use translation for modal title */}
        {error && <p className="error">{error}</p>}
        {showConfirm ? (
          <div className="confirmation">
            <p>{t('Are you sure you want to delete this client?')}</p> {/* Use translation for confirmation message */}
            <button className="confirm-button" onClick={handleDelete} disabled={loading}>{t('Yes')}</button> {/* Use translation for buttons */}
            <button className="cancel-button" onClick={() => setShowConfirm(false)} disabled={loading}>{t('No')}</button>
          </div>
        ) : (
          <>
            <label>
              {t('name')}
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              {t('phone number')}
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label>
              {t('Balance')}
              <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} />
            </label>
            <div className="modal-buttons">
              <button className="update-button" onClick={handleUpdate} disabled={loading}>{t('Modify')}</button> {/* Use translation for buttons */}
              <button className="delete-button" onClick={() => setShowConfirm(true)} disabled={loading}>{t('Delete')}</button>
              <button className="cancel-button" onClick={onClose}>{t('Cancel')}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientModal;
