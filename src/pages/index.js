import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/styles.module.css';

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Add event listener for clicks outside the menu
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.nav')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div>
      <h1>Task Manager</h1>
      <nav className={`${styles.nav} ${showMenu ? styles.showMenu : ''}`}>
        <ul>
          <li><Link href="/tasks" onClick={() => setShowMenu(false)}>Tasks</Link></li>
          <li><Link href="/clients" onClick={() => setShowMenu(false)}>Clients</Link></li>
          <li><Link href="/staff" onClick={() => setShowMenu(false)}>Staff</Link></li>
          <li><Link href="/task_statuses" onClick={() => setShowMenu(false)}>Task Statuses</Link></li>
          <li><Link href="/log" onClick={() => setShowMenu(false)}>Logs</Link></li>
        </ul>
      </nav>
      {/* Your page content here */}
    </div>
  );
}