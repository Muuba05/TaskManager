import { useState, useEffect } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    }
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.task_id}>
              <h2>{task.description}</h2>
              <p>Priority: {task.priority.description}</p>
              <p>Client: {task.client.name}</p>
              <p>Staff: {task.staff.name}</p>
              <p>Status: {task.task_status.description}</p>
              <p>Created Date: {new Date(task.created_date).toLocaleDateString()}</p>
              {task.resolved_date && (
                <p>Resolved Date: {new Date(task.resolved_date).toLocaleDateString()}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
