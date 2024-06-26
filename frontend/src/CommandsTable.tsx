import React from 'react';
import './CommandsTable.css'; // Import CSS file

interface Client {
    name: string;
}

interface Product {
    name: string;
}

interface Command {
    _id: string;
    client: Client;
    product: Product;
    quantity: number;
    totalPrice: number;
}

interface CommandsTableProps {
    commands: Command[];
}

const CommandsTable: React.FC<CommandsTableProps> = ({ commands }) => {
    return (
        <div className="commands-table-container">
            <table className="commands-table">
                <thead>
                    <tr>
                        <th>Client Name</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {commands.map((command) => (
                        <tr key={command._id}>
                            <td>{command.client.name}</td>
                            <td>{command.product.name}</td>
                            <td>{command.quantity}</td>
                            <td>{command.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CommandsTable;

