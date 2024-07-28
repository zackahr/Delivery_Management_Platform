import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AddCommand.css';
import DashboardHeader from '../pages/DashboardHeader';

const ip = import.meta.env.VITE_IP_ADDRESS;

interface Client {
  _id: string;
  name: string;
}

const AddCommand: React.FC = () => {
  const [clientName, setClientName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productQuantity, setProductQuantity] = useState<string>('');
  const [priceGivenByClient, setPriceGivenByClient] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize the translation hook

  useEffect(() => {
    const fetchUserAndClients = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch the current user's data
        const userResponse = await axios.get(`https://${ip}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = userResponse.data;
        const location = userData.data.location;

        // Fetch clients based on the user's location
        const clientsResponse = await axios.get(`https://${ip}/api/client/location/${location}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(clientsResponse.data);

      } catch (error) {
        console.error('Error fetching user and clients:', error);
      }
    };

    fetchUserAndClients();
  }, []);

  useEffect(() => {
    setFilteredClients(
      clients.filter((client) =>
        client.name.toLowerCase().startsWith(clientName.toLowerCase())
      )
    );
  }, [clientName, clients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalPrice = parseFloat((parseFloat(productPrice) * parseFloat(productQuantity)).toFixed(2)); // Ensure floating-point precision
    const newCommand = {
      clientName,
      productPrice: parseFloat(productPrice),
      productQuantity: parseFloat(productQuantity),
      priceGivenByClient: parseFloat(priceGivenByClient),
      totalPrice,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://${ip}/api/command`, newCommand, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Show success message
      setShowSuccess(true);

      // Clear input fields
      setClientName('');
      setProductPrice('');
      setProductQuantity('');
      setPriceGivenByClient('');

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error adding command:', error);
    }
  };

  const handleClientNameClick = (name: string) => {
    setClientName(name);
    setFilteredClients([]);
  };

  return (
    <div>
      <DashboardHeader />
      <div className="add-command-container">
        <h3>{t('Add Command')}</h3>
        {showSuccess && (
          <div className="success-popup">
            <p>{t('Command successfully added!')}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t('name')}</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            {filteredClients.length > 0 && (
              <ul className="client-dropdown">
                {filteredClients.map((client) => (
                  <li key={client._id} onClick={() => handleClientNameClick(client.name)}>
                    {client.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-group">
            <label>{t('Price')}</label>
            <input
              type="text"
              value={productPrice}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) setProductPrice(value);
              }}
              required
            />
          </div>
          <div className="input-group">
            <label>{t('Quantity')}</label>
            <input
              type="text"
              value={productQuantity}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) setProductQuantity(value);
              }}
              required
            />
          </div>
          <div className="input-group">
            <label>{t('Total money Given')}</label>
            <input
              type="text"
              value={priceGivenByClient}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) setPriceGivenByClient(value);
              }}
              required
            />
          </div>
          <button className='btn' type="submit">{t('Save')}</button>
        </form>
      </div>
    </div>
  );
};

export default AddCommand;
