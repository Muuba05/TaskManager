import React, { useState, useEffect } from 'react';
import styles from '../styles/client.module.css';
import Link from 'next/link';

export default function Client() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ id: '', name: '', telephone_number: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddClient = async () => {
    console.log('Adding client...', newClient);

    // Convert id and telephone_number to integers
    const id = parseInt(newClient.id, 10);
    const telephoneNumber = parseInt(newClient.telephone_number, 10);

    if (isNaN(id)) {
      console.error('Invalid ID: Must be a number');
      return;
    }

    if (isNaN(telephoneNumber)) {
      console.error('Invalid Telephone Number: Must be a number');
      return;
    }

    // Create a payload with id and telephone_number as integers
    const clientData = {
      id,
      name: newClient.name,
      telephone_number: telephoneNumber,
    };

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      console.log("Response status:", res.status);
      if (res.ok) {
        const addedClient = await res.json();
        setClients([...clients, addedClient]);
        setNewClient({ id: '', name: '', telephone_number: '' });
      } else {
        const errorData = await res.json();
        console.error('Failed to add client:', errorData.error);
      }
    } catch (error) {
      console.error('Failed to add client:', error);
    }
  };

  return (
    <div className={styles.clientContainer}>
      <h1 className={styles.clientHeader}>Clients</h1>
      <div className={styles.returnButtonContainer}>
        <Link href="/">
          <button className={styles.returnButton}>Return</button>
        </Link>
      </div>
      <div className={styles.formContainer}>
        <input
          className={styles.input}
          type="text"
          name="name"
          value={newClient.name}
          onChange={handleInputChange}
          placeholder="Enter client name"
        />
        <input
          className={styles.input}
          type="number"
          name="id"
          value={newClient.id}
          onChange={handleInputChange}
          placeholder="Enter client ID"
        />
        <input
          className={styles.input}
          type="number"
          name="telephone_number"
          value={newClient.telephone_number}
          onChange={handleInputChange}
          placeholder="Enter telephone number"
        />
        <button className={styles.button} onClick={handleAddClient}>Add Client</button>
      </div>
      {clients.length === 0 ? (
        <p>No clients available.</p>
      ) : (
        <ul className={styles.ul}>
          {clients.map((client) => (
            <li className={styles.li} key={client.client_id}>
              <h2>{client.name}</h2>
              <p>Client ID: {client.client_id}</p>
              <p>Telephone Number: {client.telephone_number}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
