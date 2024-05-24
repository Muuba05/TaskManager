import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        include: {
          client: true,
          staff: true,
          priority: true,
          task_status: true
        }
      });
      const formattedTasks = tasks.map(task => ({
        ...task, 
        priorityDescription: task.priority.description ,
        task_statusDescription: task.task_status.description,
        clientName: task.client.name,
        staffName: task.staff.name,
        // Add the description field
      }));
      console.log("Database connection successful. Retrieved tasks:", tasks);
      res.status(200).json(formattedTasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  } else if (req.method === 'POST') {
    const { description, priority_id, client_id, staff_id, task_status_id = null } = req.body;
    const convertedIds = {
      priority_id: parseInt(priority_id, 10),
      client_id: parseInt(client_id, 10),
      staff_id: parseInt(staff_id, 10),
      task_status_id: task_status_id ? parseInt(task_status_id, 10) : null,
    };

    try {
      const task = await prisma.task.create({
        data: {
          description,
          priority: { connect: { priority_id: convertedIds.priority_id } }, // Use the correct field name
          client: { connect: { client_id: convertedIds.client_id } }, // Use the correct field name
          staff: { connect: { staff_id: convertedIds.staff_id } }, // Use the correct field name
          task_status: { connect: { task_status_id: convertedIds.task_status_id } }, // Use the correct field name
          created_date: new Date(),
        },
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error creating task' });
    }
  } else if (req.method === 'PUT') { 
    const { description, priority_id, client_id, staff_id, task_status_id } = req.body;
    try {
      const task = await prisma.task.create({
        data: {
          description,
          priority: { connect: { id: priority_id } },
          client: { connect: { id: client_id } },
          staff: { connect: { id: staff_id } },
          task_status: { connect: { id: task_status_id } },
          created_date: new Date(),
        },
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error creating task' });
    }
  } else {
    res.status(405).end();
  }
}