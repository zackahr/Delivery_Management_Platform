import React, { useState } from 'react';
import axios from 'axios';
import './AddUserForm.css';
import { useTranslation } from 'react-i18next';

interface AddUserFormProps {
  onUserAdded: () => void;
  onCancel: () => void; // Ensure onCancel prop is defined
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onUserAdded, onCancel }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>(''); // State for user role selection
  const [error, setError] = useState<string | null>(null);

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      if (!token) {
        throw new Error('No token found');
      }
      if (role !== 'admin' && role !== 'delivery') {
        throw new Error('Invalid role selected');
      }
      await axios.post(
        'http://nest-mongodb:3000/users/register',
        { username, password, role }, // Include role in the POST request body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUserAdded();
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user');
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setRole('');
    setError(null);
    onCancel(); // Call onCancel prop to handle removal or hiding of the form
  };

  return (
    <div className="add-user-form">
      {error && <div className="error">{error}</div>}
      <div className="form-group">
        <label>{t('Username')}</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>{t('Password')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>{t('Role')}</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">-- {t('Select Role')} --</option>
          <option value="admin">{t('Admin')}</option>
          <option value="delivery">{t('Delivery')}</option>
        </select>
      </div>
      <div className="button-group">
        <button className="add" onClick={handleAddUser}>
          {t('Add User')}
        </button>
        <button className="cancel" onClick={handleCancel}>
          {t('Cancel')}
        </button>
      </div>
    </div>
  );
};

export default AddUserForm;
