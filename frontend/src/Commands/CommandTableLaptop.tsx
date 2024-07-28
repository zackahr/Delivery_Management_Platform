import React, { useState } from 'react';
import { Command } from './UserCommands';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './CommandTableLaptop.css';
import ConfirmationModal from './ConfirmationModal'; // Import the modal component

interface CommandTableLaptopProps {
  commands: Command[];
  onModify: (command: Command) => void;
  onDelete: (commandId: string) => void;
}

const CommandTableLaptop: React.FC<CommandTableLaptopProps> = ({ commands, onModify, onDelete }) => {
  const { t } = useTranslation(); // Initialize the translation hook
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commandToDelete, setCommandToDelete] = useState<Command | null>(null);

  const handleDeleteClick = (command: Command) => {
    setCommandToDelete(command);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (commandToDelete) {
      onDelete(commandToDelete._id);
      setCommandToDelete(null);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCommandToDelete(null);
  };

  const getClientStatusClass = (status: string) => {
    return status === 'paid' ? 'client-status-paid' : 'client-status-not-paid';
  };

  return (
    <>
      <table className="commands-table">
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('Quantity')}</th>
            <th>{t('Price')}</th>
            <th>{t('Total')}</th>
            <th>{t('Paid Amount')}</th>
            <th>{t('Total Rest Amount')}</th>
            <th>{t('Date')}</th>
            <th>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command) => (
            <tr key={command._id}>
              <td>{command.clientName}</td>
              <td>{command.productQuantity}</td>
              <td>{command.productPrice}</td>
              <td>{command.totalPrice}</td>
              <td>{command.priceGivenByClient}</td>
              <td>{command.totalPrice - command.priceGivenByClient}</td>
              <td>{new Date(command.createdAt).toLocaleString()}</td>
              <td>
                <button className="modify" onClick={() => onModify(command)}>{t('Modify')}</button>
                <button className="delete" onClick={() => handleDeleteClick(command)}>{t('Delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmationModal
        isOpen={showModal}
        message={t('Are you sure you want to delete this command?')}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default CommandTableLaptop;
