import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Task Manager</h1>
      <nav>
        <ul>
          <li><Link href="/tasks">Tasks</Link></li>
          <li><Link href="/clients">Clients</Link></li>
          <li><Link href="/staff">Staff</Link></li>
          <li><Link href="/priorities">Priorities</Link></li>
          <li><Link href="/task_statuses">Task Statuses</Link></li>
        </ul>
      </nav>
    </div>
  );
}
