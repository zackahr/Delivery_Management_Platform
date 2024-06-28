// AddProduct.tsx

import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

interface AddProductProps {
  onProductAdded: () => void; // Callback function to handle product added event
}

const AddProduct: React.FC<AddProductProps> = ({ onProductAdded }) => {
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        name: newProductName,
        price: parseFloat(newProductPrice)
      };
      await axios.post('http://localhost:3000/products/', newProduct);
      setNewProductName('');
      setNewProductPrice('');
      setError(null);
      onProductAdded(); // Notify parent component that product has been added
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error adding product:', error.response?.data || error.message);
        setError('Failed to add product. Please try again.');
      } else {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="add-product-container">
      <input
        type="text"
        placeholder="Enter Product Name"
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Product Price"
        value={newProductPrice}
        onChange={(e) => setNewProductPrice(e.target.value)}
      />
      <button className="add-product-button" onClick={handleAddProduct}>Add Product</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddProduct;
