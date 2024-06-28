import React, { useState } from 'react';
import axios from 'axios';
import './AddCommand.css'; // Import CSS file


interface AddCommandProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setShowAddCommand: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddCommand: React.FC<AddCommandProps> = ({ setError, setShowAddCommand }) => {
  const [clientName, setClientName] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddCommand = async () => {
    try {
      const newCommand = { clientName, productName, quantity: parseInt(quantity) };
      const response = await axios.post('http://localhost:3000/commands/', newCommand);
      console.log('Command added successfully!', response.data);
      setClientName('');
      setProductName('');
      setQuantity('');
      setError(null);
      setShowAddCommand(false); // Hide AddCommand component after success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error adding command:', error.response?.data || error.message);
        setError('Failed to add command. Please try again.');
      } else {
        console.error('Error:', error);
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="add-command-container">
      <input
        type="text"
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleAddCommand}>Add Command</button>
    </div>
  );
};

export default AddCommand;
