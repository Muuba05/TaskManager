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
      await prisma.log.create({
        data: {
          task: { connect: { task_id: task.task_id } },
          description: `Task "${task.description}" created.`
        }
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error creating task' });
    }
  } else if (req.method === 'DELETE') {
    const taskId = parseInt(req.query.taskId, 10);
    console.log("task id is", taskId)
    try {
      const deletedTask = await prisma.task.delete({
        where: {
          task_id: taskId, 
        },
      });
      if (!deletedTask.task_id) {
        throw new Error('Task not found!');
      }
      await prisma.log.create({
        data: {
          deletedTask: { connect: { task_id: deletedTask.task_id } },
          description: `Task "${deletedTask.description}" deleted.`,
          // Add other log properties if needed 
          // For example, if you want to add staff and client information:
          staff: deletedTask.staff ? {
            connect: { staff_id: deletedTask.staff.staff_id }
          } : null,
          client: deletedTask.client ? {
            connect: { client_id: deletedTask.client.client_id }
          } 
          : null,
          task: {
            connect: { task_id: deletedTask.task_id }
          },
        }
      });
      res.status(200).json(deletedTask);
    } catch (error) {
      res.status(500).json({ error: 'Error deleting task' });
    }
  }  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}