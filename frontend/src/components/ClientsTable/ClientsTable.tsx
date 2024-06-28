import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientsTable.css'; // Import CSS file

interface Client {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
}

interface ClientsTableProps {
  clients: Client[];
  onUpdateClient: (updatedClient: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, onUpdateClient, onDeleteClient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [editClientName, setEditClientName] = useState<string>('');
  const [editClientAddress, setEditClientAddress] = useState<string>('');
  const [editClientPhoneNumber, setEditClientPhoneNumber] = useState<string>('');

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(clients);
      return;
    }

    const filteredClients = clients.filter(client =>
      client.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredClients);
  }, [searchQuery, clients]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleModifyClient = (clientId: string) => {
    const clientToModify = clients.find(client => client._id === clientId);
    if (clientToModify) {
      setEditClientId(clientId);
      setEditClientName(clientToModify.name);
      setEditClientAddress(clientToModify.address);
      setEditClientPhoneNumber(clientToModify.phoneNumber);
    }
  };

  const handleCancelModify = () => {
    setEditClientId(null);
    setEditClientName('');
    setEditClientAddress('');
    setEditClientPhoneNumber('');
  };

  const handleUpdateClient = async () => {
    if (!editClientId) return;

    try {
      const response = await axios.patch(`http://localhost:3000/clients/${editClientId}`, {
        name: editClientName,
        address: editClientAddress,
        phoneNumber: editClientPhoneNumber,
      });
      
      const updatedClient = { _id: editClientId, name: editClientName, address: editClientAddress, phoneNumber: editClientPhoneNumber };
      onUpdateClient(updatedClient);

      setError(null);
      setEditClientId(null); // Reset edit mode
      console.log(`Client with id ${editClientId} modified successfully.`);
    } catch (error) {
      console.error('Error modifying client:', error);
      setError('Failed to modify client. Please try again.');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await axios.delete(`http://localhost:3000/clients/${clientId}`);
      onDeleteClient(clientId);
      setError(null);
      console.log(`Client with id ${clientId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Failed to delete client. Please try again.');
    }
  };

  return (
    <div className="clients-table-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Address"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <table className="clients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.length > 0 ? (
            searchResults.map((client) => (
              <tr key={client._id}>
                <td>{editClientId === client._id ? (
                  <input
                    type="text"
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                  />
                ) : (
                  client.name
                )}</td>
                <td>{editClientId === client._id ? (
                  <input
                    type="text"
                    value={editClientAddress}
                    onChange={(e) => setEditClientAddress(e.target.value)}
                  />
                ) : (
                  client.address
                )}</td>
                <td>{editClientId === client._id ? (
                  <input
                    type="text"
                    value={editClientPhoneNumber}
                    onChange={(e) => setEditClientPhoneNumber(e.target.value)}
                  />
                ) : (
                  client.phoneNumber
                )}</td>
                <td>
                  {editClientId === client._id ? (
                    <>
                      <button onClick={handleUpdateClient}>Save</button>
                      <button onClick={handleCancelModify}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleModifyClient(client._id)}>Modify</button>
                      <button onClick={() => handleDeleteClient(client._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;
