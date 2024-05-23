  import { useState, useEffect } from 'react';

  export default function Priorities() {
    const [priorities, setPriorities] = useState([]);
  
    useEffect(() => {
      async function fetchPriorities() {
        const res = await fetch('/api/priorities');
        const data = await res.json();
        setPriorities(data);
      }
      fetchPriorities();
    }, []);
  
    return (
      <div>
        <h1>Priorities</h1>
        {priorities.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul>
            {priorities.map((client) => (
              <li key={priorities.priority_id}>
                <h2>{priority.description}</h2>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  