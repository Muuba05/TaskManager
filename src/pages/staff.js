import React, { useState, useEffect } from 'react';
import styles from '../styles/staff.module.css';
import Link from 'next/link';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({ id: '', name: '' });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      setStaff(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const handleAddStaff = async () => {
    console.log('Adding staff...', newStaff);

    const id = parseInt(newStaff.id, 10);

    if (isNaN(id)) {
      console.error('Invalid ID: Must be a number');
      return;
    }

    const staffData = {
      id,
      name: newStaff.name,
    };

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffData),
      });

      console.log("Response status:", res.status);
      if (res.ok) {
        const addedStaff = await res.json();
        setStaff([...staff, addedStaff]);
        setNewStaff({ id: '', name: '' });
      } else {
        const errorData = await res.json();
        console.error('Failed to add staff:', errorData.error);
      }
    } catch (error) {
      console.error('Failed to add staff:', error);
    }
  };

  return (
    <div className={styles.staffContainer}>
      <h1 className={styles.staffHeader}>Staff</h1>
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
          value={newStaff.name}
          onChange={handleInputChange}
          placeholder="Enter staff name"
        />
        <input
          className={styles.input}
          type="number"
          name="id"
          value={newStaff.id}
          onChange={handleInputChange}
          placeholder="Enter staff ID"
        />
        <button className={styles.button} onClick={handleAddStaff}>Add Staff</button>
      </div>
      {staff.length === 0 ? (
        <p>No staff available.</p>
      ) : (
        <ul className={styles.ul}>
          {staff.map((staff) => (
            <li className={styles.li} key={staff.staff_id}>
              <h2>{staff.name}</h2>
              <p>Staff ID: {staff.staff_id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
