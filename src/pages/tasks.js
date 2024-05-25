import React, { useState, useEffect } from 'react';
import styles from '../styles/tasks.module.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriorityId, setNewTaskPriorityId] = useState('');
  const [newTaskClientId, setNewTaskClientId] = useState('');
  const [newTaskStaffId, setNewTaskStaffId] = useState('');
  const [newTaskStatusId, setNewTaskStatusId] = useState('');

  const [clients, setClients] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [staff, setStaff] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, clientsRes, prioritiesRes, staffRes, taskStatusesRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/clients'),
          fetch('/api/priorities'),
          fetch('/api/staff'),
          fetch('/api/task_status'),
        ]);

        const [tasksData, clientsData, prioritiesData, staffData, taskStatusesData] = await Promise.all([
          tasksRes.json(),
          clientsRes.json(),
          prioritiesRes.json(),
          staffRes.json(),
          taskStatusesRes.json(),
        ]);

        setTasks(tasksData);
        setClients(clientsData);
        setPriorities(prioritiesData);
        setStaff(staffData);
        setTaskStatuses(taskStatusesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNewTaskDescriptionChange = (e) => {
    setNewTaskDescription(e.target.value);
  };

  const handleNewTaskPriorityChange = (e) => {
    setNewTaskPriorityId(e.target.value);
  };

  const handleNewTaskClientChange = (e) => {
    setNewTaskClientId(e.target.value);
  };

  const handleNewTaskStaffChange = (e) => {
    setNewTaskStaffId(e.target.value);
  };

  const handleNewTaskStatusChange = (e) => {
    setNewTaskStatusId(e.target.value);
  };

  const handleSubmitNewTask = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newTaskDescription,
          priority_id: newTaskPriorityId,
          client_id: newTaskClientId,
          staff_id: newTaskStaffId,
          task_status_id: newTaskStatusId,
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setNewTaskDescription('');
        setNewTaskPriorityId('');
        setNewTaskClientId('');
        setNewTaskStaffId('');
        setNewTaskStatusId('');
      } else {
        console.error('Error creating new task');
      }
    } catch (error) {
      console.error('Error submitting new task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks?taskId=${taskId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTasks(tasks.filter((task) => task.task_id !== taskId));
        showAlert('Task deleted successfully');
      } else {
        console.error('Error deleting task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskFinish = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/finish?taskId=${taskId}`, {
        method: 'PUT',
      });

      if (res.ok) {
        setTasks(tasks.filter((task) => task.task_id !== taskId));
        showAlert('Task finished successfully');
      } else {
        console.error('Error finishing task');
      }
    } catch (error) {
      console.error('Error finishing task:', error);
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        const tasksData = await res.json();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [newTaskDescription]);

  const groupedTasks = {};
  taskStatuses.forEach((status) => {
    groupedTasks[status.description] = tasks.filter(
      (task) => task.task_statusDescription === status.description
    );
  });

  return (
    <div className={styles.tasksContainer}>
      <h1 className={styles.tasksHeader}>Tasks</h1>
      <form className={styles.formContainer} onSubmit={handleSubmitNewTask}>
        <label className={styles.label} htmlFor="new-task-description">Description:</label>
        <input
          className={styles.input}
          type="text"
          id="new-task-description"
          value={newTaskDescription}
          onChange={handleNewTaskDescriptionChange}
        />

        <label className={styles.label} htmlFor="new-task-priority">Priority:</label>
        <select
          className={styles.select}
          id="new-task-priority"
          value={newTaskPriorityId}
          onChange={handleNewTaskPriorityChange}
        >
          <option value="">Select Priority</option>
          {priorities.map((priority) => (
            <option key={priority.priority_id} value={priority.priority_id}>
              {priority.description}
            </option>
          ))}
        </select>

        <label className={styles.label} htmlFor="new-task-client">Client:</label>
        <select
          className={styles.select}
          id="new-task-client"
          value={newTaskClientId}
          onChange={handleNewTaskClientChange}
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.name}
            </option>
          ))}
        </select>

        <label className={styles.label} htmlFor="new-task-staff">Staff:</label>
        <select
          className={styles.select}
          id="new-task-staff"
          value={newTaskStaffId}
          onChange={handleNewTaskStaffChange}
        >
          <option value="">Select Staff</option>
          {staff.map((staffMember) => (
            <option key={staffMember.staff_id} value={staffMember.staff_id}>
              {staffMember.name}
            </option>
          ))}
        </select>

        <label className={styles.label} htmlFor="new-task-status">Status:</label>
        <select
          className={styles.select}
          id="new-task-status"
          value={newTaskStatusId}
          onChange={handleNewTaskStatusChange}
        >
          <option value="">Select Status</option>
          {taskStatuses.map((status) => (
            <option key={status.task_status_id} value={status.task_status_id}>
              {status.description}
            </option>
          ))}
        </select>

        <button className={styles.button} type="submit">Add Task</button>
      </form>

      {Object.keys(groupedTasks).map((status) => (
        <div key={status}>
          <h2 className={styles.tasksHeader}>{status}</h2>
          {groupedTasks[status].length === 0 ? (
            <p>No tasks in this status.</p>
          ) : (
            <ul className={styles.ul}>
              {groupedTasks[status].map((task) => (
                <li className={styles.li} key={task.task_id}>
                  <h2>{task.description}</h2>
                  <p>Priority: {task.priorityDescription}</p>
                  <p>Client: {task.clientName}</p>
                  <p>Staff: {task.staffName}</p>
                  <p>Status: {task.task_statusDescription}</p>
                  <p>Created Date: {new Date(task.created_date).toLocaleDateString()}</p>
                  {task.resolved_date && (
                    <p>Resolved Date: {new Date(task.resolved_date).toLocaleDateString()}</p>
                  )}
                  <button className={styles.button} onClick={() => handleDeleteTask(task.task_id)}>Delete</button>
                  {!task.resolved_date && (
                    <button className={styles.button} onClick={() => handleTaskFinish(task.task_id)}>Complete</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
