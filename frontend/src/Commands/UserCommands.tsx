import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CommandTableLaptop from './CommandTableLaptop';
import CommandTablePhone from './CommandTablePhone';
import DashboardHeader from '../pages/DashboardHeader';
import { useTranslation } from 'react-i18next';

const ip = import.meta.env.VITE_IP_ADDRESS;

export interface Command {
  _id: string;
  clientName: string;
  productPrice: number;
  productQuantity: number;
  totalPrice: number;
  priceGivenByClient: number;
  clientStatus: string;
  createdBy: string;
  createdAt: string;
  restAmount?: number; // Optional field for rest amount
}

interface DailySummary {
  date: string;
  totalQuantity: number;
  totalAmount: number;
  totalPriceGiven: number;
  totalRestAmount: number;
}

interface GroupedCommands {
  [date: string]: Command[];
}

const UserCommands: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { t } = useTranslation();
  const [commands, setCommands] = useState<GroupedCommands>({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [commandToModify, setCommandToModify] = useState<Command | null>(null);
  const [updatedPrice, setUpdatedPrice] = useState<string>('');
  const [updatedQuantity, setUpdatedQuantity] = useState<string>('');
  const [updatedPriceGiven, setUpdatedPriceGiven] = useState<string>('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Initialize with today's date
  const [allClients, setAllClients] = useState<string[]>([]); // Store all client IDs
  const [clientsWithCommands, setClientsWithCommands] = useState<string[]>([]); // Store clients who received commands
  const [clients, setClients] = useState<any[]>([]); // Adjust type if needed
  const [totalClients, setTotalClients] = useState<number>(0);

  const fetchAllClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://${ip}/api/client`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const clientsArray = response.data || [];

      if (Array.isArray(clientsArray)) {
        setClients(clientsArray);
        setTotalClients(clientsArray.length);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };
  
  useEffect(() => {
    fetchCommands(selectedDate);
    fetchAllClients(); // Fetch all clients when component mounts
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userId, selectedDate]);

  const groupCommandsByDate = (commands: Command[]): GroupedCommands => {
    const clientsSet = new Set<string>(); // Store unique client IDs
    const grouped = commands.reduce((acc: GroupedCommands, command: Command) => {
      const date = new Date(command.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(command);
      clientsSet.add(command.clientName); // Add the client ID to the set
      return acc;
    }, {});

    const uniqueClientsForDate = Array.from(clientsSet); // Get unique clients for the selected date
    setClientsWithCommands(uniqueClientsForDate); // Store unique clients
    return grouped;
  };
  

  const fetchCommands = async (date: string) => {
    try {
      const token = localStorage.getItem('token');
      const formattedDate = new Date(date).toISOString().split('T')[0];

      const response = await axios.get(`https://${ip}/api/command/date/${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const commandsArray = response.data?.data || [];

      if (Array.isArray(commandsArray)) {
        const grouped = groupCommandsByDate(commandsArray);
        setCommands(grouped);
        calculateDailySummaries(commandsArray);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
  };

  const calculateDailySummaries = (commands: Command[]) => {
    const summaries: Record<string, DailySummary> = {};

    commands.forEach(command => {
      const date = new Date(command.createdAt).toISOString().split('T')[0];
      if (!summaries[date]) {
        summaries[date] = {
          date,
          totalQuantity: 0,
          totalAmount: 0,
          totalPriceGiven: 0,
          totalRestAmount: 0,
        };
      }

      const restAmount = command.totalPrice - command.priceGivenByClient;

      summaries[date].totalQuantity += command.productQuantity;
      summaries[date].totalAmount += command.totalPrice;
      summaries[date].totalPriceGiven += command.priceGivenByClient;
      summaries[date].totalRestAmount += restAmount;
    });

    setDailySummaries(Object.values(summaries));
  };

  useEffect(() => {
    fetchCommands(selectedDate);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userId, selectedDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleDeleteCommand = async (commandId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://${ip}/api/command/${commandId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCommands(selectedDate);
    } catch (error) {
      console.error('Error deleting command:', error);
    }
  };

  const handleModifyCommand = (command: Command) => {
    setCommandToModify(command);
    setUpdatedPrice(command.productPrice.toString());
    setUpdatedQuantity(command.productQuantity.toString());
    setUpdatedPriceGiven(command.priceGivenByClient.toString());
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!commandToModify) return;

    const price = parseFloat(updatedPrice);
    const quantity = parseFloat(updatedQuantity);
    const priceGiven = parseFloat(updatedPriceGiven);

    if (isNaN(price) || isNaN(quantity) || isNaN(priceGiven)) {
      alert('Please enter valid numbers');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updatedCommand = {
        ...commandToModify,
        productPrice: price,
        productQuantity: quantity,
        totalPrice: price * quantity,
        priceGivenByClient: priceGiven,
      };
      await axios.put(`https://${ip}/api/command/${commandToModify._id}`, updatedCommand, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCommands(selectedDate);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error updating command:', error);
    }
  };

  return (
    <div>
      <DashboardHeader />
      <div className="date-picker">
        <label>{t('Select Date')}:</label>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>
      {Object.keys(commands)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map(date => (
          <div key={date} className="daily-commands">
            <div className="commands-table-container">
              {isMobile ? (
                <CommandTablePhone
                  commands={commands[date]}
                  onModify={handleModifyCommand}
                  onDelete={handleDeleteCommand}
                />
              ) : (
                <CommandTableLaptop
                  commands={commands[date]}
                  onModify={handleModifyCommand}
                  onDelete={handleDeleteCommand}
                />
              )}
            </div>
            <div className="daily-summary">
              {dailySummaries
                .filter(summary => summary.date === date)
                .map((summary) => (
                  <div key={summary.date} className="summary-row">
                    <div>{t('Total Quantity')}: {summary.totalQuantity}</div>
                    <div>{t('Total')}: {summary.totalAmount.toFixed(2)}</div>
                    <div>{t('Total Rest Amount')}: {summary.totalRestAmount.toFixed(2)}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      {isFormVisible && commandToModify && (
        <div className="modify-command-form">
          <form onSubmit={handleFormSubmit}>
            <h1>{t('Modify Command')}</h1>
            <div className="form-group">
              <label>{t('Price')}</label>
              <input
                type="text"
                value={updatedPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) setUpdatedPrice(value);
                }}
              />
            </div>
            <div className="form-group">
              <label>{t('Quantity')}</label>
              <input
                type="text"
                value={updatedQuantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) setUpdatedQuantity(value);
                }}
              />
            </div>
            <div className="form-group">
              <label>{t('Total money Given')}</label>
              <input
                type="text"
                value={updatedPriceGiven}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) setUpdatedPriceGiven(value);
                }}
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="save">{t('Save')}</button>
              <button type="button" className="cancel" onClick={() => setIsFormVisible(false)}>{t('Cancel')}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserCommands;