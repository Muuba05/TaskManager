import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      console.log("Database connection successful. Retrieved tasks:", tasks);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  } else if (req.method === 'POST') {
    const { description, priority_id, client_id, staff_id, task_status_id } = req.body;
    try {
      const task = await prisma.task.create({
        data: {
          description,
          priority_id,
          client_id,
          staff_id,
          task_status_id,
          created_date: new Date(),
        },
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error creating task' });
    }
  } else if (req.method === 'PUT') { // Handle PUT request for adding a task
    const { description, priority_id, client_id, staff_id, task_status_id } = req.body;
    try {
      const task = await prisma.task.create({
        data: {
          description,
          priority_id,
          client_id,
          staff_id,
          task_status_id,
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