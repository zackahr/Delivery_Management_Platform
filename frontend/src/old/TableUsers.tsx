import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TableUsers.css'; // Import CSS styles for TableUsers
import { useTranslation } from 'react-i18next';
import AddUserForm from './AddUserForm';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  username: string;
  password: string;
}

interface DecodedToken {
  _id: string;
  username: string;
  role: string;
}

const ip = import.meta.env.VITE_IP_ADDRESS;

const TableUsers: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modifiedUser, setModifiedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false); // State for AddUserForm visibility

  useEffect(() => {
    fetchUser();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchQuery]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`https://${ip}/api/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      if (!token) {
        throw new Error('No token found');
      }
      const decodedToken: DecodedToken = jwtDecode(token);

      const response = await axios.get<User>(`https://${ip}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const currentUser = {
        _id: response.data._id,
        username: decodedToken.username,
        password: '', // Password should not be stored in plain text
      };
      setCurrentUser(currentUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      // Navigate to login page if necessary
      // navigate('/login', { replace: true });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      await axios.delete(`https://${ip}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user._id !== id));
      setFilteredUsers(filteredUsers.filter(user => user._id !== id));
      setError(null);
    } catch (error) {
      handleAxiosError(error, 'delete user');
    }
  };

  const handleModifyUser = (user: User) => {
    setSelectedUser(user);
    setModifiedUser({ ...user });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModifiedUser(prevState => ({
      ...prevState!,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (modifiedUser) {
      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.patch(`https://${ip}/api/users/${modifiedUser._id}`, modifiedUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User modified successfully!', response.data);
        await fetchUsers();
        setSelectedUser(null);
        setError(null);
      } catch (error) {
        handleAxiosError(error, 'modify user');
      }
    }
  };

  const handleCancel = () => {
    setSelectedUser(null);
  };

  const handleAxiosError = (error: any, action: string) => {
    if (error.response) {
      setError(`Error during ${action}: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      setError(`Error during ${action}: No response received`);
    } else {
      setError(`Error during ${action}: ${error.message}`);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUserAdded = () => {
    setShowAddUserForm(false);
    fetchUsers();
  };

  const handleCancelAddUserForm = () => {
    setShowAddUserForm(false);
  };

  return (
    <div className="users-table-container">
      {error && <div className="error">{error}</div>}
      <input
        className="search-bar"
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder={t('Search by client name...')}
      />
      <button className="add-user-btn" onClick={() => setShowAddUserForm(true)}>
        {t('Add User')}
      </button>
      {showAddUserForm && <AddUserForm onUserAdded={handleUserAdded} onCancel={handleCancelAddUserForm} />}
      <table className="users-table">
        <thead>
          <tr>
            <th>{t('Username')}</th>
            <th>{t('Password')}</th>
            <th>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <React.Fragment key={user._id}>
              <tr>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>
                  <button className="modify" onClick={() => handleModifyUser(user)}>
                    {t('Modify')}
                  </button>
                  <button className="delete" onClick={() => handleDeleteUser(user._id)}>
                    {t('Delete')}
                  </button>
                </td>
              </tr>
              {selectedUser && selectedUser._id === user._id && (
                <tr>
                  <td colSpan={3}>
                    <div className="modify-user-form">
                      <h1>{t('Modify User')}</h1>
                      <div className="form-group">
                        <label>{t('Username')}</label>
                        <input
                          type="text"
                          name="username"
                          value={modifiedUser?.username || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t('Password')}</label>
                        <input
                          type="password"
                          name="password"
                          value={modifiedUser?.password || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-buttons">
                        <button className="save" onClick={handleSaveChanges}>{t('Save')}</button>
                        <button className="cancel" onClick={handleCancel}>{t('Cancel')}</button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableUsers;
