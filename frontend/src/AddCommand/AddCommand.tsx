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
    const [locationUser, setLocationUser] = useState<string>('');
    const [servedClients, setServedClients] = useState<string[]>([]); // Track served clients by their IDs
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<string>('0.00'); // State for total price
    const navigate = useNavigate();
    const { t } = useTranslation(); // Initialize the translation hook
    useEffect(() => {
        const handleClientSearch = async () => {
            if (clientName.trim() === '') {
                setFilteredClients([]);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const userResponse = await axios.get(`https://${ip}/api/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = userResponse.data;
                const location = userData.data.location;
                setLocationUser(userData.data.location);
                console.log("loca ==>",locationUser)

                // Fetch clients based on the user's location and filter by name
                const clientsResponse = await axios.get(`https://${ip}/api/client/location/${location}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const allClients = clientsResponse.data;
                console.log(allClients);
                const filtered = allClients.filter((client) =>
                    client.name.toLowerCase().startsWith(clientName.toLowerCase())
                );
                setFilteredClients(filtered);

            } catch (error) {
                console.error('Error fetching and filtering clients:', error);
            }
        };

        handleClientSearch();
    }, [clientName]);
    
    useEffect(() => {
        const fetchClientsWithCommandsToday = async () => {
            try {
                const token = localStorage.getItem('token');
                const today = new Date().toISOString().split('T')[0];

                // Fetch commands for today
                const commandsResponse = await axios.get(`https://${ip}/api/command/date/${today}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const commandsArray = commandsResponse.data?.data || [];
                // Get the names of clients who have commands today
                const clientNamesWithCommands = commandsArray.map(command => command.clientName).filter(name => name);

                // Fetch all clients based on the location
                const userResponse = await axios.get(`https://${ip}/api/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = userResponse.data;
                const location = userData.data.location;
                const clientsResponse = await axios.get(`https://${ip}/api/client/location/${location}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const allClients = clientsResponse.data || [];
                console.log("served", allClients)
                // Filter clients whose names are not in clientNamesWithCommands (so they haven't placed commands today)
                const filteredClients = allClients.filter(client => !clientNamesWithCommands.includes(client.name));

                setClients(filteredClients);
                if (filteredClients.length > 0) {
                    // Automatically select the first client from the filtered list
                    setClientName(filteredClients[0].name);
                }

            } catch (error) {
                console.error('Error fetching clients with commands today:', error);
            }
        };

        fetchClientsWithCommandsToday();
    }, [servedClients]); // Re-run when served clients change

    useEffect(() => {
        // Calculate total price whenever productPrice or productQuantity changes
        const price = parseFloat(productPrice.replace(',', '.')) || 0;
        const quantity = parseFloat(productQuantity.replace(',', '.')) || 0;
        setTotalPrice((price * quantity / 100).toFixed(2));
    }, [productPrice, productQuantity]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newCommand = {
            clientName,
            productPrice: parseFloat(productPrice.replace(',', '.')) / 100,
            productQuantity: parseFloat(productQuantity.replace(',', '.')),
            priceGivenByClient: parseFloat(priceGivenByClient.replace(',', '.')),
            totalPrice: parseFloat(totalPrice.replace(',', '.')) / 100,
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

            // Add the served client to the servedClients list
            const servedClient = clients.find(client => client.name === clientName);
            if (servedClient) {
                setServedClients([...servedClients, servedClient._id]);
            }

            // Clear input fields
            setClientName('');
            setProductPrice('');
            setProductQuantity('');
            setPriceGivenByClient('');
            setTotalPrice('0.00'); // Reset total price

            // Hide success message after 5 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);

        } catch (error) {
            console.error('Error adding command:', error);
        }
    };

    // Function to handle numeric input with comma replacement
    const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(',', '.');
        if (/^\d*\.?\d*$/.test(value)) {
            setter(value);
        }
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
                            onClick={() => {
                                if (clients.length > 0) {
                                    setClientName(clients[0].name); // Automatically select the first client when clicked
                                }
                            }}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('Price')}</label>
                        <input
                            type="text"
                            inputMode="decimal" // Request numeric keyboard with decimal support
                            value={productPrice}
                            onChange={handleNumericInputChange(setProductPrice)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('Quantity')}</label>
                        <input
                            type="text"
                            inputMode="decimal" // Request numeric keyboard with decimal support
                            value={productQuantity}
                            onChange={handleNumericInputChange(setProductQuantity)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('Total')}</label>
                        <p>{totalPrice} DH</p> {/* Display the calculated total price */}
                    </div>
                    <div className="input-group">
                        <label>{t('Total money Given')}</label>
                        <input
                            type="text"
                            inputMode="decimal" // Request numeric keyboard with decimal support
                            value={priceGivenByClient}
                            onChange={handleNumericInputChange(setPriceGivenByClient)}
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
