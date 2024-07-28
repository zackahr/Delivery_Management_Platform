import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Command } from './UserCommands';
import './CommandTablePhone.css';

interface CommandTablePhoneProps {
  commands: Command[];
  onModify: (command: Command) => void;
  onDelete: (commandId: string) => void;
}

const CommandTablePhone: React.FC<CommandTablePhoneProps> = ({ commands, onModify, onDelete }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <table className="commands-table">
      <thead>
        <tr>
          <th>{t('name')}</th>
          <th>{t('Total Rest Amount')}</th>
          <th>{t('Date')}</th>
          <th>{t('Actions')}</th>
        </tr>
      </thead>
      <tbody>
        {commands.map((command) => (
          <tr key={command._id}>
            <td>{command.clientName}</td>
            <td>{(command.totalPrice - command.priceGivenByClient).toFixed(2)}</td>
            <td>{new Date(command.createdAt).toLocaleString()}</td>
            <td>
              <button className="modify" onClick={() => onModify(command)}>{t('More')}</button>
              <button className="delete" onClick={() => onDelete(command._id)}>{t('Delete')}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CommandTablePhone;
