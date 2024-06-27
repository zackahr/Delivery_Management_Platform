import React, { useState } from 'react';
import axios from 'axios';
import './ProductsTable.css';
import ConfirmationDialog from './ConfirmationDialog'; // Import the confirmation dialog component

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface ProductsTableProps {
  products: Product[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editProductName, setEditProductName] = useState<string>('');
  const [editProductPrice, setEditProductPrice] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleEditClick = (product: Product) => {
    setEditProductId(product._id);
    setEditProductName(product.name);
    setEditProductPrice(product.price);
  };

  const handleCancelClick = () => {
    setEditProductId(null);
  };

  const handleUpdateClick = async (id: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/products/${id}`, {
        name: editProductName,
        price: editProductPrice,
      });

      // Update the product in the local state
      const updatedProduct = response.data;
      setProducts(products.map(product => product._id === id ? updatedProduct : product));
      setEditProductId(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setShowConfirmation(true);
    setProductToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`http://localhost:3000/products/${productToDelete}`);
        // Update the local state by removing the deleted product
        setProducts(products.filter(product => product._id !== productToDelete));
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setShowConfirmation(false);
        setProductToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setProductToDelete(null);
  };

  return (
    <div className="products-table-container">
      <h2>Products</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                {editProductId === product._id ? (
                  <input
                    type="text"
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editProductId === product._id ? (
                  <input
                    type="number"
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(Number(e.target.value))}
                  />
                ) : (
                  `$${product.price.toFixed(2)}`
                )}
              </td>
              <td>
                {editProductId === product._id ? (
                  <>
                    <button onClick={() => handleUpdateClick(product._id)}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(product)}>Update</button>
                    <button onClick={() => handleDeleteClick(product._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this product?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ProductsTable;
