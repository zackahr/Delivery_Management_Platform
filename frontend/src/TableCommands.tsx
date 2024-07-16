import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TableCommands.css'; // Import CSS styles for TableCommands
import { useTranslation } from 'react-i18next';

interface Command {
  _id: string;
  client: string;
  clientAddress: string; // Add client address field
  product: string;
  price: number; // Add product price field
  quantity: number;
  totalPrice: number;
  paid: boolean;
  paidAmount?: number;
  remain?: number;
  createdAt: string; // Date of creation as string
}

const ip = import.meta.env.VITE_IP_ADDRESS;

const TableCommands: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [commands, setCommands] = useState<Command[]>([]);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [modifiedCommand, setModifiedCommand] = useState<Command | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchCommands();
  }, []);

  useEffect(() => {
    // Update filteredCommands whenever commands or searchQuery changes
    if (searchQuery.trim() === '') {
      setFilteredCommands(commands); // No search query, show all commands
    } else {
      const filtered = commands.filter(command =>
        command.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommands(filtered);
    }
  }, [commands, searchQuery]);

  const fetchCommands = async () => {
    try {
      const response = await axios.get(`http://${ip}:3000/commands/`);
      const fetchedCommands = response.data.map((command: any) => ({
        _id: command._id, // Ensure this is correctly fetched from your API response
        client: command.commandOwner,
        clientAddress: command.userAddress, // Map userAddress to clientAddress
        product: command.productName,
        price: parseFloat(command.productPrice), // Parse productPrice as float
        quantity: command.productQuantity,
        totalPrice: parseFloat(command.totalPrice), // Parse totalPrice as float
        paid: command.paidStatus || false,
        paidAmount: parseFloat(command.paidAmount) || 0, // Parse paidAmount as float
        remain: parseFloat(command.paidRemain) || 0, // Parse remain as float
        createdAt: formatDate(new Date(command.createdAt)), // Format createdAt date
      }));
      setCommands(fetchedCommands);
      setFilteredCommands(fetchedCommands); // Update filtered commands as well
      setError(null);
    } catch (error) {
      console.error('Error fetching commands:', error);
      setError('Failed to fetch commands');
    }
  };

  const formatDate = (date: Date): string => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(i18n.language, options); // Use i18n.language for locale
  };

  const handleDeleteCommand = async (id: string) => {
    try {
      await axios.delete(`http://${ip}:3000/commands/${id}`);
      // Update commands state to remove the deleted command
      setCommands(commands.filter(command => command._id !== id));
      setFilteredCommands(filteredCommands.filter(command => command._id !== id)); // Also update filtered commands
      console.log(`Command with id ${id} deleted successfully.`);
      setError(null); // Clear any previous error messages
    } catch (error) {
      handleAxiosError(error, 'delete command');
    }
  };

  const handleModifyCommand = (command: Command) => {
    setSelectedCommand(command);
    setModifiedCommand({ ...command }); // Create a copy for modification
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Conditionally parse value based on input name
    const parsedValue =
      name === 'price' || name === 'quantity' || name === 'paidAmount' ? parseFloat(value.replace(',', '.')) : value;
    setModifiedCommand(prevState => ({
      ...prevState!,
      [name]: parsedValue,
    }));
  };

  const handleSaveChanges = async () => {
    if (modifiedCommand) {
      try {
        console.log('Modified Command:', modifiedCommand); // Log the modified command

        // Create an object with only the required fields
        const updateData = {
          commandOwner: modifiedCommand.client,
          userAddress: modifiedCommand.clientAddress,
          productName: modifiedCommand.product,
          productPrice: modifiedCommand.price,
          productQuantity: modifiedCommand.quantity,
          paidAmount: modifiedCommand.paidAmount,
        };

        const response = await axios.patch(`http://${ip}:3000/commands/${modifiedCommand._id}`, updateData);
        console.log('Command modified successfully!', response.data);

        // Fetch updated commands
        await fetchCommands();
        setSelectedCommand(null);
        setError(null);
      } catch (error) {
        handleAxiosError(error, 'modify command');
      }
    }
  };

  const handleCancel = () => {
    setSelectedCommand(null);
  };

  const handleAxiosError = (error: any, action: string) => {
    if (error.response) {
      console.error(`Server responded with status code ${error.response.status} during ${action}`);
      console.error('Response data:', error.response.data);
      setError(`Error during ${action}: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      console.error(`No response received during ${action}`, error.request);
      setError(`Error during ${action}: No response received`);
    } else {
      console.error(`Error setting up request during ${action}`, error.message);
      setError(`Error during ${action}: ${error.message}`);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="commands-table-container">
      {error && <div className="error">{error}</div>}
      <input className="search-bar"
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder={t('Search by client name...')}
      />
      <table className="commands-table">
        <thead>
          <tr>
            <th>{t('Client')}</th>
            <th>{t('Address')}</th>
            <th>{t('Product')}</th>
            <th>{t('Price')}</th>
            <th>{t('Quantity')}</th>
            <th>{t('Total')}</th>
            <th>{t('Amount')}</th>
            <th>{t('Remain')}</th>
            <th>{t('Status')}</th>
            <th>{t('Date')}</th>
            <th>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredCommands.map((command) => (
            <React.Fragment key={command._id}>
              <tr>
                <td>{command.client}</td>
                <td>{command.clientAddress}</td>
                <td>{command.product}</td>
                <td>{command.price.toFixed(2)} DH</td> {/* Display product price formatted */}
                <td>{command.quantity}</td>
                <td>{command.totalPrice.toFixed(2)} DH</td> {/* Display totalPrice formatted */}
                <td>{command.paidAmount ? `${command.paidAmount.toFixed(2)} DH` : '0.00 DH'}</td> {/* Display paidAmount formatted */}
                <td>{command.remain ? `${command.remain.toFixed(2)} DH` : '0.00 DH'}</td> {/* Display remain formatted */}
                <td style={{ color: command.paid ? 'green' : 'red', fontWeight: 'bold' }}>
                  {command.paid ? t('Paid') : t('Not Paid')}
                </td>
                <td>{command.createdAt}</td> {/* Display createdAt formatted */}
                <td>
                  <button className="modify" onClick={() => handleModifyCommand(command)}>
                    {t('Modify')}
                  </button>
                  <button className="delete" onClick={() => handleDeleteCommand(command._id)}>
                    {t('Delete')}
                  </button>
                </td>
              </tr>
              {selectedCommand && selectedCommand._id === command._id && (
                <tr>
                  <td colSpan={10}>
                    <div className="modify-command-form">
                      <h1>{t('Modify Command')}</h1>
                      <div className="form-group">
                        <label>{t('Client')}</label>
                        <input
                          type="text"
                          name="client"
                          value={modifiedCommand?.client || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t('Address')}</label>
                        <input
                          type="text"
                          name="clientAddress"
                          value={modifiedCommand?.clientAddress || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t('Product Name')}</label>
                        <input
                          type="text"
                          name="product"
                          value={modifiedCommand?.product || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t('Price')}</label>
                        <input
                          type="number"
                          name="price"
                          value={modifiedCommand?.price.toString() || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t('Quantity')}</label>
                        <input
                          type="number"
                          name="quantity"
                          value={modifiedCommand?.quantity.toString() || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t('Paid Amount')}</label>
                        <input
                          type="number"
                          name="paidAmount"
                          value={modifiedCommand?.paidAmount?.toString() || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-buttons">
                        <button className="save" onClick={handleSaveChanges}>{t('Save')}</button>
                        <button className="cancel" onClick={handleCancel}>{t('Cancel')}</button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCommands;
