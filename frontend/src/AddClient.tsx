import React, { useState } from 'react';
import axios from 'axios';
import './AddClient.css'; // Import CSS

interface AddClientProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setShowAddClient: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddClient: React.FC<AddClientProps> = ({ setError, setShowAddClient }) => {
  const [newClientName, setNewClientName] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientPhoneNumber, setNewClientPhoneNumber] = useState('');

  const handleAddClient = async () => {
    try {
      const newClient = { name: newClientName, address: newClientAddress, phoneNumber: newClientPhoneNumber };
      const response = await axios.post('http://localhost:3000/clients/', newClient);
      console.log('Client added successfully!', response.data);
      setNewClientName('');
      setNewClientAddress('');
      setNewClientPhoneNumber('');
      setError(null);
      setShowAddClient(false); // Hide AddClient component after success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error adding client:', error.response?.data || error.message);
        setError('Failed to add client. Please try again.');
      } else {
        console.error('Error:', error);
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="add-client-container">
      <input
        type="text"
        placeholder="Client Name"
        value={newClientName}
        onChange={(e) => setNewClientName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Client Address"
        value={newClientAddress}
        onChange={(e) => setNewClientAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={newClientPhoneNumber}
        onChange={(e) => setNewClientPhoneNumber(e.target.value)}
      />
      <button onClick={handleAddClient}>Add Client</button>
    </div>
  );
};

export default AddClient;
