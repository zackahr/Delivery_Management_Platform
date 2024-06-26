// ProductsTable.tsx

import React from 'react';
import axios from 'axios';
import './ProductsTable.css'; // Import corresponding CSS file if exists

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface ProductsTableProps {
  products: Product[];
  onUpdateProduct: (productId: string, newName: string, newPrice: number) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, onUpdateProduct, onDeleteProduct }) => {
  const handleUpdateProduct = async (productId: string) => {
    // Example: Updating a product (patch method)
    const updatedName = prompt('Enter updated name:');
    const updatedPrice = parseFloat(prompt('Enter updated price:')) || 0;

    if (updatedName !== null && updatedPrice !== null) {
      try {
        await axios.patch(`http://localhost:3000/products/${productId}`, {
          name: updatedName,
          price: updatedPrice,
        });
        onUpdateProduct(productId, updatedName, updatedPrice);
      } catch (error) {
        console.error('Error updating product:', error);
        // Handle error (e.g., show error message)
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    // Example: Deleting a product (delete method)
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:3000/products/${productId}`);
        onDeleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        // Handle error (e.g., show error message)
      }
    }
  };

  return (
    <div className="products-table-container">
      <h2>Products</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                {/* Update and Delete buttons */}
                <button onClick={() => handleUpdateProduct(product._id)}>Update</button>
                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
