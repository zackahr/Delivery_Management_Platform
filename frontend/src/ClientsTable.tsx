import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientsTable.css'; // Import CSS file

interface Client {
    _id: string;
    name: string;
    address: string;
    phoneNumber: string;
}

interface ClientsTableProps {
    clients: Client[];
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Client[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const filteredClients = clients.filter(client =>
            client.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredClients);
    }, [searchQuery, clients]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="clients-table-container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Address"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            <table className="clients-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone Number</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.length > 0 ? (
                        searchResults.map((client) => (
                            <tr key={client._id}>
                                <td>{client.name}</td>
                                <td>{client.address}</td>
                                <td>{client.phoneNumber}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No results found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsTable;
