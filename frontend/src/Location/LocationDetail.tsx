import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../pages/DashboardHeader';
import ClientModal from './ClientModal';
import './LocationDetail.css';

const ip = import.meta.env.VITE_IP_ADDRESS;

interface Client {
  _id: string;
  name: string;
  phone: string;
  location: {
    _id: string;
    name: string;
  };
  balance: number;
}

const LocationDetail: React.FC = () => {
  const { locationName } = useParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { t } = useTranslation();

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://${ip}/api/client/location/name/${locationName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [locationName]);

  const handleMoreClick = (client: Client) => {
    setSelectedClient(client);
  };

  const handleCloseModal = () => {
    setSelectedClient(null);
  };

  const totalBalance = clients.reduce((acc, client) => acc + client.balance, 0);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
        {t('Loading...')}
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader />
      <div className="location-detail">
        <main className="location-detail-content">
          <h2>{t('Clients in')} {locationName}</h2>
          <div className="total-credit">
            <h3>{totalBalance.toFixed(2)} : {t('Total')}</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('phone number')}</th>
                <th>{t('Location Name')}</th>
                <th>{t('Balance')}</th>
                <th>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                  <td>{client.location.name}</td>
                  <td>{client.balance.toFixed(2)} DH</td>
                  <td>
                    <button className="more-button" onClick={() => handleMoreClick(client)}>
                      {t('More')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      {selectedClient && (
        <ClientModal client={selectedClient} onClose={handleCloseModal} refreshClients={fetchClients} />
      )}
    </div>
  );
};

export default LocationDetail;
