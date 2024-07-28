import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { NavigationProvider } from './api/NavigationContext';
import { UserRoleProvider, useUserRole } from './context/UserRoleContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserCommands from './Commands/UserCommands';
import Locations from './Location/LocationList';
import LocationDetail from './Location/LocationDetail';
import Settings from './Settings/Settings';
import AddCommand from './AddCommand/AddCommand';
import AddClient from './AddClient/AddClient';
import AddLocationAndUser from './user/AddLocationAndUser';
import SettingsGlobal from './Settings/SettingsGlobal';

const AppRoutes: React.FC = () => {
  const { userRole } = useUserRole();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/user/:userId/commands" element={<UserCommands />} />
      <Route path="/locations" element={<Locations />} />
      <Route path="/location/:locationName" element={<LocationDetail />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/add-command" element={<AddCommand />} />
      <Route path="/add-client" element={<AddClient />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {userRole === 'admin' && (
        <>
          <Route path="/add-location-and-user" element={<AddLocationAndUser />} />
          <Route path="/settings-global" element={<SettingsGlobal />} />
        </>
      )}
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <NavigationProvider>
          <UserRoleProvider>
            <AppRoutes />
          </UserRoleProvider>
        </NavigationProvider>
      </Router>
    </I18nextProvider>
  );
};

export default App;
