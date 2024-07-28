import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './SettingsGlobal.css';
import DashboardHeader from '../pages/DashboardHeader';

const ip = import.meta.env.VITE_IP_ADDRESS;

interface User {
  _id: string;
  name: string;
  password: string;
  role: string;
}

const SettingsGlobal: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://${ip}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (userId: string, field: keyof User, value: string) => {
    setUsers(users.map(user => user._id === userId ? { ...user, [field]: value } : user));
  };

  const handleSave = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const user = users.find(user => user._id === userId);
      await axios.patch(`https://${ip}/api/user/${userId}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(t('User updated successfully'));
    } catch (error) {
      console.error('Error updating user:', error);
      alert(t('Error updating user'));
    }
  };

  if (loading) {
    return (
      <div className="loading-circle">
        <div></div>
        {t('Loading...')}
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader />
      <div className="settings-global">
        <table>
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('Password')}</th>
              <th>{t('Role')}</th>
              <th>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => handleInputChange(user._id, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={user.password}
                    onChange={(e) => handleInputChange(user._id, 'password', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleInputChange(user._id, 'role', e.target.value)}
                  >
                    <option value="admin">{t('Admin')}</option>
                    <option value="delivery">{t('Delivery')}</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleSave(user._id)}>{t('Save')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsGlobal;
