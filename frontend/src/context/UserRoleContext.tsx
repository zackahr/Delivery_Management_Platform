import React, { createContext, useContext, useState } from 'react';

interface UserRoleContextProps {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
}

const UserRoleContext = createContext<UserRoleContextProps | undefined>(undefined);

export const UserRoleProvider: React.FC = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextProps => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
