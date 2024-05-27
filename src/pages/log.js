import React, { useState, useEffect } from 'react';
import styles from '../styles/log.module.css';
import Link from 'next/link';

function LogPage() {
  const [logs, setLogs] = useState([]);
  const [showNoLogsMessage, setShowNoLogsMessage] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/log');
        const data = await response.json();
        setLogs(data);
        setShowNoLogsMessage(data.length === 0); // Set flag based on data length
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  const handleDeleteLog = async (logId) => {
    try {
      const res = await fetch(`/api/log?logId=${logId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Update the logs state by filtering out the deleted log
        setLogs(logs.filter((log) => log.log_id !== logId));
        showAlert("Log deleted successfully");
      } else {
        console.error('Error deleting log');
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const showAlert = (message) => {
    const alertContainer = document.createElement('div');
    alertContainer.classList.add(styles.alert);
    alertContainer.textContent = message;
    document.body.appendChild(alertContainer);

    setTimeout(() => {
      document.body.removeChild(alertContainer);
    }, 5000);
  };

  return (
    <div className={styles.logPageContainer}>
      <h2 className={styles.logHeader}>Logs</h2>
      <div className={styles.returnButtonContainer}>
        <Link href="/">
          <button className={styles.returnButton}>Return</button>
        </Link>
      </div>
      {showNoLogsMessage && <p className={styles.noLogsMessage}>No logs found.</p>} {/* Show message if no logs */}
      <ul className={styles.logList}>
        {logs.map((log) => (
          <li className={styles.logItem} key={log.log_id}>
            <div className={styles.logDescription}>
              <strong>Description:</strong> {log.description}
            </div>
            <div className={styles.logDate}>
              <strong>Created Date:</strong> {new Date(log.created_date).toLocaleString()}
            </div>
            <button className={styles.button} onClick={() => handleDeleteLog(log.log_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LogPage;
