import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './DailySummary.css';
import DashboardHeader from '../pages/DashboardHeader';
import ProgressCircle from './ProgressCircle';

interface DailySummaryProps {}

interface Command {
    _id: string;
    clientName: string;
    productPrice: number;
    productQuantity: number;
    totalPrice: number;
    priceGivenByClient: number;
    clientStatus: string;
    createdBy: string;
    createdAt: string;
    restAmount?: number;
}

interface Client {
    _id: string;
    name: string;
    phone: string;
    location: { _id: string; name: string };
    balance: number;
}

const DailySummary: React.FC<DailySummaryProps> = () => {
    const { t } = useTranslation();
    const [clientsWithCommands, setClientsWithCommands] = useState<number>(0);
    const [totalClients, setTotalClients] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const ip = import.meta.env.VITE_IP_ADDRESS;

    const fetchCommandsAndClients = async (date: string) => {
        try {
            console.log('Fetching data for:', date);

            const token = localStorage.getItem('token');

            // Fetch commands for the selected date
            const commandsResponse = await axios.get(`https://${ip}/api/command/date/${date}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Commands Response:', commandsResponse.data);
            const commands = commandsResponse.data.data || [];

            // Fetch all clients
            const loc = localStorage.getItem('location')
            const clientsResponse = await axios.get(`https://${ip}/api/client/location/name/${loc}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const clients = clientsResponse.data || [];

            // Ensure commands is an array
            if (!Array.isArray(commands)) {
                throw new Error('Commands data is not an array');
            }

            // Check clients data
            if (!Array.isArray(clients)) {
                throw new Error('Clients data is not an array');
            }
            
            // Calculate clients with commands
            const clientsWithCommandsSet = new Set(commands.map((command: Command) => command.clientName));
            const clientsWithCommandsCount = clientsWithCommandsSet.size;

            // Set states
            setClientsWithCommands(clientsWithCommandsCount);
            setTotalClients(clients.length);

            console.log('Total Clients:', clients.length);
            console.log('Clients with Commands:', clientsWithCommandsCount);

        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchCommandsAndClients(selectedDate);
    }, [selectedDate]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    const percentageClientsLeft = totalClients > 0
        ? ((clientsWithCommands / totalClients) * 100).toFixed(2) // Round to 2 decimal places
        : '0.00';

    const unservedClients = totalClients - clientsWithCommands;

    // Calculate color based on the unserved clients percentage
    const getColor = (percentage: number) => {
        if (percentage === 100) return 'red';
        if (percentage >= 80 && percentage < 100) return 'orange';
        if (percentage >= 35 && percentage < 80) return 'yellow';
        return 'green';
    };

    return (
        <div className="parent">
            <DashboardHeader />
            <div className="date-picker-container">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>
            <div className="client-summary">
                <div className="circle-container">
                    <div className="circle">
                        <div className="progress-wrapper">
                            <ProgressCircle percentage={parseFloat(percentageClientsLeft)} />
                        </div>
                        <div className="label">{t('Number of customers served')}</div>
                        <div
                            className="unserved-clients"
                            style={{ color: getColor((unservedClients / totalClients) * 100) }}
                        >
                          <p>  {unservedClients} </p>
                        </div>
                        <div className="label">{t('Not served Yet')}</div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailySummary;
