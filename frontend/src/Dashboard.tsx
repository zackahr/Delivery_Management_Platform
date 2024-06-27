import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import AddCommand from './AddCommand';
import AddClient from './AddClient';
import ClientsTable from './ClientsTable';
import CommandsTable from './CommandsTable';
import ProductsTable from './ProductsTable';
import AddProduct from './AddProduct';

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
  client: Client | null;
  product: Product | null;
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
  const [showAddProduct, setShowAddProduct] = useState(false);
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
      setShowAddProduct(false);
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
      setShowAddProduct(false);
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
      setShowAddProduct(false);
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
    setShowAddProduct(false);
  };

  const handleShowAddClient = () => {
    setShowAddClient(true);
    setShowClients(false);
    setShowAddCommand(false);
    setShowCommands(false);
    setShowProducts(false);
    setShowAddProduct(false);
  };

  const handleShowProducts = () => {
    fetchProducts();
    setShowAddProduct(false);
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
    setShowClients(false);
    setShowAddCommand(false);
    setShowAddClient(false);
    setShowCommands(false);
    setShowProducts(false);
  };

  const handleModifyCommand = async (id: string, updatedCommand: Partial<Command>) => {
    try {
      const payload = {
        clientName: updatedCommand.client?.name,
        productName: updatedCommand.product?.name,
        quantity: updatedCommand.quantity,
        // totalPrice will be calculated on the server-side
      };
  
      const response = await axios.patch(`http://localhost:3000/commands/${id}`, payload);
  
      // Update commands state
      setCommands(commands.map(command => {
        if (command._id === id) {
          return {
            ...command,
            quantity: response.data.quantity,
            totalPrice: response.data.totalPrice, // If totalPrice is returned from server
            // Optionally, preserve client and product data from existing command
            client: command.client,
            product: command.product,
          };
        }
        return command; // Return unchanged commands
      }));
  
      setError(null);
      console.log(`Command with id ${id} modified successfully.`);
    } catch (error) {
      handleAxiosError(error, 'modify command');
    }
  };
  
  const handleDeleteCommand = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/commands/${id}`);
      setCommands(commands.filter(command => command._id !== id));
      setError(null);
      console.log(`Command with id ${id} deleted successfully.`);
    } catch (error) {
      handleAxiosError(error, 'delete command');
    }
  };

  const handleProductAdded = () => {
    fetchProducts();
    setShowAddProduct(false);
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
      {showCommands && <CommandsTable commands={commands} onModifyCommand={handleModifyCommand} onDeleteCommand={handleDeleteCommand} />}
      {showProducts && <ProductsTable products={products} />}

      {showAddProduct && <AddProduct onProductAdded={handleProductAdded} />}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Dashboard;
