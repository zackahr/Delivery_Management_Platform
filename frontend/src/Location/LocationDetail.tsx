import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../pages/DashboardHeader';
import ClientModal from './ClientModal';
import './LocationDetail.css';

const ip = import.meta.env.VITE_IP_ADDRESS;

interface Location {
  _id: string;
  name: string;
}

interface ClientLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Client {
  _id: string;
  name: string;
  phone: string;
  location: Location; // Main location for the client
  clientLocation: ClientLocation; // Client-specific location details
  balance: number;
}

const LocationDetail: React.FC = () => {
  const { locationName } = useParams<{ locationName: string }>();
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
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
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

  const handleShowMap = (client: Client) => {
    if (client.clientLocation) {
      const { latitude, longitude } = client.clientLocation;
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      alert('No location information available for this client.');
    }
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
          <div className="total-credit">
            <h3>{totalBalance.toFixed(2)} DH : {t('Total')}</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>{t('N')}</th>
                <th>{t('name')}</th>
                <th>{t('phone number')}</th>
                <th>{t('Balance')}</th>
                <th>{t('Actions')}</th>
                <th>{t('Location')}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={client._id}>
                  <td>{index + 1}</td>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                  <td>{client.balance.toFixed(2)} DH</td>
                  <td>
                    <button className="more-button" onClick={() => handleMoreClick(client)}>
                      {t('Modify')}
                    </button>
                  </td>
                  <td>
                    <button className="map-button" onClick={() => handleShowMap(client)}>
                      {t('Show Map')}
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
