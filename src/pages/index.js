import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/index.module.css'; // Importing the styles module

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
    <div className={styles.tasksContainer}> {}
      <h1 className={styles.tasksHeader}>Task Manager</h1> {}
      <nav className={`${styles.nav} ${showMenu ? styles.showMenu : ''}`}>
        <ul className={styles.ul}> {}
          <li className={styles.li}><Link href="/tasks" onClick={() => setShowMenu(false)}>Tasks</Link></li> {}
          <li className={styles.li}><Link href="/clients" onClick={() => setShowMenu(false)}>Clients</Link></li> {}
          <li className={styles.li}><Link href="/staff" onClick={() => setShowMenu(false)}>Staff</Link></li> {}
          <li className={styles.li}><Link href="/log" onClick={() => setShowMenu(false)}>Logs</Link></li> {}
        </ul>
      </nav>
      {}
    </div>
  );
}
