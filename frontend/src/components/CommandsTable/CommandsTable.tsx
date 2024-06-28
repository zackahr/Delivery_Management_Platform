import React, { useState } from 'react';
import './CommandsTable.css';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

interface Client {
  name: string;
}

interface Product {
  name: string;
}

interface Command {
  _id: string;
  client: Client | null;
  product: Product | null;
  quantity: number;
  totalPrice: number;
}

interface CommandsTableProps {
  commands: Command[];
  onModifyCommand: (id: string, updatedCommand: Partial<Command>) => void;
  onDeleteCommand: (id: string) => void;
}

const CommandsTable: React.FC<CommandsTableProps> = ({ commands, onModifyCommand, onDeleteCommand }) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedCommand, setEditedCommand] = useState<Partial<Command>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [commandToDelete, setCommandToDelete] = useState<string | null>(null);

  const handleModifyClick = (id: string, command: Command) => {
    setEditMode(id);
    setEditedCommand({ ...command });
  };

  const handleSaveClick = () => {
    if (editMode) {
      onModifyCommand(editMode, editedCommand);
      setEditMode(null);
      setEditedCommand({});
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedCommand(prevState => ({
      ...prevState,
      [name]: name === 'quantity' || name === 'totalPrice' ? Number(value) : value
    }));
  };
  

  const handleDeleteClick = (id: string) => {
    setCommandToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (commandToDelete) {
      onDeleteCommand(commandToDelete);
      setCommandToDelete(null);
      setShowConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setCommandToDelete(null);
    setShowConfirmation(false);
  };

  return (
    <div className="commands-table-container">
      <table className="commands-table">
        <thead>
          <tr>
            <th>Client Name</th>

            <th>Product Name</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command) => (
            <tr key={command._id}>
              <td>
                {editMode === command._id ? (
                  <input
                    type="text"
                    name="clientName"
                    value={editedCommand.client?.name || ''}
                      onChange={handleInputChange}
                  />
                ) : (
                  command.client ? command.client.name : 'N/A'
                )}
              </td>
              <td>
                {editMode === command._id ? (
                  <input
                    type="text"
                    name="productName"
                    value={editedCommand.product?.name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  command.product ? command.product.name : 'N/A'
                )}
              </td>
              <td>
                {editMode === command._id ? (
                  <input
                    type="number"
                    name="quantity"
                    value={editedCommand.quantity || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  command.quantity
                )}
              </td>
              <td>
                {editMode === command._id ? (
                  <input
                    type="number"
                    name="totalPrice"
                    value={editedCommand.totalPrice || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  `${command.totalPrice.toFixed(2)}DH`
                )}
              </td>
              <td>
                {editMode === command._id ? (
                  <>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={() => setEditMode(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleModifyClick(command._id, command)}>Modify</button>
                    <button onClick={() => handleDeleteClick(command._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this command?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default CommandsTable;
