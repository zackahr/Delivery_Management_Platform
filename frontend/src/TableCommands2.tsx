// TableCommands2.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './TableCommands2.css'; // Import CSS styles for TableCommands2

interface Command {
  _id: string;
  client: string;
  clientAddress: string;
  product: string;
  price: number;
  quantity: number;
  totalPrice: number;
  paid: boolean;
  paidAmount?: number;
  remain?: number;
  createdAt: string;
}

const TableCommands2: React.FC = () => {
  const { t } = useTranslation(); // Use the useTranslation hook

  const [commands, setCommands] = useState<Command[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [modifiedClient, setModifiedClient] = useState<string>('');
  const [modifiedProduct, setModifiedProduct] = useState<string>('');
  const [modifiedPrice, setModifiedPrice] = useState<string>('0.00'); // Format as string for display
  const [modifiedQuantity, setModifiedQuantity] = useState<number>(0);
  const [modifiedPaidAmount, setModifiedPaidAmount] = useState<string>('0.00'); // Format as string for display
  const [modifiedAddress, setModifiedAddress] = useState<string>(''); // Format as string for display
  const [searchQuery, setSearchQuery] = useState<string>(''); // Add state for search query

  // Define fetchCommands outside useEffect
  const fetchCommands = async () => {
    try {
      const response = await axios.get(`http://${ip}:3000/commands/`);
      const fetchedCommands = response.data.map((command: any) => ({
        _id: command._id,
        client: command.commandOwner,
        clientAddress: command.userAddress,
        product: command.productName,
        price: parseFloat(command.productPrice),
        quantity: command.productQuantity,
        totalPrice: parseFloat(command.totalPrice),
        paid: command.paidStatus || false,
        paidAmount: parseFloat(command.paidAmount) || 0,
        remain: parseFloat(command.paidRemain) || 0,
        createdAt: new Date(command.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));
      setCommands(fetchedCommands);
      setError(null);
    } catch (error) {
      console.error('Error fetching commands:', error);
      setError('Failed to fetch commands');
    }
  };

  useEffect(() => {
    fetchCommands(); // Call fetchCommands to fetch initial data
  }, []);

  const handleMoreClick = (command: Command) => {
    setSelectedCommand(command);
    setModifiedClient(command.client);
    setModifiedProduct(command.product);
    setModifiedPrice(command.price.toFixed(2)); // Format price to 2 decimal places
    setModifiedQuantity(command.quantity);
    setModifiedPaidAmount((command.paidAmount || 0).toFixed(2)); // Format paid amount to 2 decimal places
    setModifiedAddress(command.clientAddress);
  };

  const handleClose = () => {
    setSelectedCommand(null);
  };

  const handleModify = async () => {
    if (selectedCommand) {
      try {
        const updateData = {
          commandOwner: modifiedClient,
          userAddress: modifiedAddress,
          productName: modifiedProduct,
          productPrice: parseFloat(modifiedPrice), // Convert to number if necessary
          productQuantity: modifiedQuantity,
          paidAmount: parseFloat(modifiedPaidAmount), // Convert to number if necessary
        };

        console.log('Modified Command:', updateData); // Log the modified command

        const response = await axios.patch(`http://${ip}:3000/commands/${selectedCommand._id}`, updateData);
        console.log('Command updated successfully!', response.data);
        fetchCommands(); // Refresh commands list after modification
        handleClose();
        // Assuming success, you may want to update state or handle success feedback
        // Refresh commands list or update specific command in state
        // Example: fetchCommands();
      } catch (error) {
        console.error('Error updating command:', error);
        // Handle error feedback
      }
    }
  };

  const handleDelete = async (command: Command) => {
    try {
      await axios.delete(`http://${ip}:3000/commands/${command._id}`);
      // Assuming success, you may want to update state or handle success feedback
      console.log('Command deleted successfully:', command._id);
      fetchCommands(); // Refresh commands list after deletion
      handleClose();
      // Refresh commands list or remove specific command from state
      // Example: fetchCommands();
    } catch (error) {
      console.error('Error deleting command:', error);
      // Handle error feedback
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter commands based on search query
  const filteredCommands = commands.filter((command) =>
    command.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="commands-table-container2">
      {error && <div className="error">{error}</div>}
      <div className="search-container">
        <input
          type="text"
          placeholder={t('Search For Client')}
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      {filteredCommands.length === 0 ? (
        <p className="no-commands-message">{t('noCommandsMessage')}</p>
      ) : (
        <table className="commands-table2">
          <thead>
            <tr>
              <th>{t('Client')}</th>
              <th>{t('Product')}</th>
              <th>{t('Remain')}</th>
              <th>{t('Status')}</th>
              <th>{t('More')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommands.map((command) => (
              <tr key={command._id}>
                <td>{command.client}</td>
                <td>{command.product}</td>
                <td>{command.remain?.toFixed(2) || '0.00'} DH</td>
                <td style={{ color: command.paid ? 'green' : 'red', fontWeight: 'bold' }}>
                  {command.paid ? t('Paid') : t('Not Paid')}
                </td>
                <td>
                  <button onClick={() => handleMoreClick(command)}>{t('More')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedCommand && (
        <div className="command-detail">
          <div className="command-detail-content">
            <h2>{t('Command Details')}</h2>
            <p>
              <strong>{t('Client')}</strong>{' '}
              <input
                type="text"
                value={modifiedClient}
                onChange={(e) => setModifiedClient(e.target.value)}
              />
            </p>
            <p>
              <strong>{t('Address')}</strong>{' '}
              <input
                type="text"
                value={modifiedAddress}
                onChange={(e) => setModifiedAddress(e.target.value)}
              />{' '}
            </p>
            <p>
              <strong>{t('Product')}</strong>{' '}
              <input
                type="text"
                value={modifiedProduct}
                onChange={(e) => setModifiedProduct(e.target.value)}
              />
            </p>
            <p>
              <strong>{t('Price')}</strong>{' '}
              <input
                type="number"
                value={modifiedPrice}
                onChange={(e) => setModifiedPrice(parseFloat(e.target.value))}
              />{' '}
            </p>
            <p>
              <strong>{t('Quantity')}</strong>{' '}
              <input
                type="number"
                value={modifiedQuantity}
                onChange={(e) => setModifiedQuantity(parseInt(e.target.value))}
              />
            </p>
            <p>
              <strong>{t('Amount')}</strong>{' '}
              <input
                type="number"
                value={modifiedPaidAmount}
                onChange={(e) => setModifiedPaidAmount(parseFloat(e.target.value))}
              />{' '}
            </p>
            <div className="command-detail-buttons">
              <button className="modify-button" onClick={handleModify}>
                {t('Modify')}
              </button>
              <button className="delete-button" onClick={() => handleDelete(selectedCommand)}>
                {t('Delete')}
              </button>
              <button className='close-btn' onClick={handleClose}>{t('Close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableCommands2;

