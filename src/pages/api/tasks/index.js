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
        priorityDescription: task.priority.description,
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
          priority: { connect: { priority_id: convertedIds.priority_id } }, 
          client: { connect: { client_id: convertedIds.client_id } }, 
          staff: { connect: { staff_id: convertedIds.staff_id } }, 
          task_status: { connect: { task_status_id: convertedIds.task_status_id } }, 
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
  } if (req.method === 'DELETE') {
    const taskId = parseInt(req.query.taskId, 10);
    console.log("Task ID is", taskId);
    
    try {
      // Find the task to ensure it exists
      const deletedTask = await prisma.task.findUnique({
        where: { task_id: taskId }
      });

      if (!deletedTask) {
        throw new Error('Task not found!');
      }

      // Log the deletion
      await prisma.log.create({
        data: {
          task_id: taskId, // Directly using task_id instead of task relationship
          description: `Task "${deletedTask.description}" deleted.`,
          created_date: new Date(),
        }
      });

      // Call the stored procedure to delete the task
      await prisma.$executeRaw`CALL delete_task(${taskId})`;

      // Respond with the deleted task
      res.status(200).json(deletedTask);
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Error deleting task' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
