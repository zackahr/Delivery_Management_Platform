// Dashboard.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import AddCommand from './AddCommand';
import AddClient from './AddClient';
import ClientsTable from './ClientsTable';
import CommandsTable from './CommandsTable';
import ProductsTable from './ProductsTable'; // Import ProductsTable component
import AddProduct from './AddProduct'; // Import AddProduct component

interface Client {
  name: string;
  address: string;
  phoneNumber: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Command {
  _id: string;
  client: Client;
  product: Product;
  quantity: number;
  totalPrice: number;
}

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showClients, setShowClients] = useState(true);
  const [showAddCommand, setShowAddCommand] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false); // State to show AddProduct component
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clients/');
      setClients(response.data);
      setShowClients(true);
      setShowAddCommand(false);
      setShowAddClient(false);
      setShowCommands(false);
      setShowProducts(false);
      setShowAddProduct(false); // Hide AddProduct component when fetching clients
      setError(null);
    } catch (error) {
      handleAxiosError(error, 'clients');
    }
  };

  const fetchCommands = async () => {
    try {
      const response = await axios.get('http://localhost:3000/commands/');
      setCommands(response.data);
      setShowCommands(true);
      setShowClients(false);
      setShowAddCommand(false);
      setShowAddClient(false);
      setShowProducts(false);
      setShowAddProduct(false); // Hide AddProduct component when fetching commands
      setError(null);
    } catch (error) {
      handleAxiosError(error, 'commands');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products/');
      setProducts(response.data);
      setShowProducts(true);
      setShowClients(false);
      setShowAddCommand(false);
      setShowAddClient(false);
      setShowCommands(false);
      setShowAddProduct(false); // Hide AddProduct component when fetching products
      setError(null);
    } catch (error) {
      handleAxiosError(error, 'products');
    }
  };

  const handleShowAddCommand = () => {
    setShowAddCommand(true);
    setShowClients(false);
    setShowAddClient(false);
    setShowCommands(false);
    setShowProducts(false);
    setShowAddProduct(false); // Hide AddProduct component when showing AddCommand form
  };

  const handleShowAddClient = () => {
    setShowAddClient(true);
    setShowClients(false);
    setShowAddCommand(false);
    setShowCommands(false);
    setShowProducts(false);
    setShowAddProduct(false); // Hide AddProduct component when showing AddClient form
  };

  const handleShowProducts = () => {
    fetchProducts();
    setShowAddProduct(false); // Hide AddProduct component when showing ProductsTable
  };

  const handleAddProduct = () => {
    setShowAddProduct(true); // Show AddProduct component when clicking "Add Products"
    setShowClients(false);
    setShowAddCommand(false);
    setShowAddClient(false);
    setShowCommands(false);
    setShowProducts(false);
  };

  const handleProductAdded = () => {
    fetchProducts(); // Fetch products again after adding a new product
    setShowAddProduct(false); // Hide AddProduct component after product is added
  };

  const handleAxiosError = (error: any, context: string) => {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching ${context}:`, error.response?.data || error.message);
      setError(`Failed to fetch ${context}. Please try again.`);
    } else {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="header-button" onClick={fetchClients}>See All Clients</button>
        <button className="header-button" onClick={handleShowAddClient}>Add New Client</button>
        <button className="header-button" onClick={handleShowAddCommand}>Create Command</button>
        <button className="header-button" onClick={fetchCommands}>See All Commands</button>
        <button className="header-button" onClick={handleShowProducts}>See All Products</button>
        <button className="header-button" onClick={handleAddProduct}>Add Products</button>
      </header>

      {showAddCommand && <AddCommand setError={setError} setShowAddCommand={setShowAddCommand} />}
      {showAddClient && <AddClient setError={setError} setShowAddClient={setShowAddClient} />}
      {showClients && <ClientsTable clients={clients} />}
      {showCommands && <CommandsTable commands={commands} />}
      {showProducts && <ProductsTable products={products} />}
      
      {/* Conditionally render AddProduct component */}
      {showAddProduct && <AddProduct onProductAdded={handleProductAdded} />}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Dashboard;
