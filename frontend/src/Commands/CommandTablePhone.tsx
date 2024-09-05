import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Command } from './UserCommands';
import ConfirmationModal from './ConfirmationModal'; // Import the ConfirmationModal component
import './CommandTablePhone.css';

interface CommandTablePhoneProps {
  commands: Command[];
  onModify: (command: Command) => void;
  onDelete: (commandId: string) => void;
}

const CommandTablePhone: React.FC<CommandTablePhoneProps> = ({ commands, onModify, onDelete }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commandToDelete, setCommandToDelete] = useState<Command | null>(null);

  const handleDeleteClick = (command: Command) => {
    setCommandToDelete(command);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (commandToDelete) {
      onDelete(commandToDelete._id);
      setCommandToDelete(null);
      setIsModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setCommandToDelete(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <table className="commands-table">
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('Total Rest Amount')}</th>
            <th>{t('Time')}</th>
            <th>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command) => (
            <tr key={command._id}>
              <td>{command.clientName}</td>
              <td>{(command.totalPrice - command.priceGivenByClient).toFixed(2)}</td>
              <td>{new Date(command.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</td>
              <td>
                <button className="modify" onClick={() => onModify(command)}>{t('More')}</button>
                <button className="delete" onClick={() => handleDeleteClick(command)}>{t('Delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          message={t('Are you sure you want to delete this command?')}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default CommandTablePhone;
