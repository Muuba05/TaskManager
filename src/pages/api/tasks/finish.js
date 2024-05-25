import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const taskId = parseInt(req.query.taskId, 10);

    try {
      const updatedTask = await prisma.task.update({
        where: {
          task_id: taskId,
        },
        data: {
          resolved_date: new Date(), // Mark the task as finished with the current date/time
          task_status: {
            connect: { task_status_id: 3 } // Assuming 3 is your 'finished' task status id
          }
        },
      });

      await prisma.log.create({
        data: {
          task: { connect: { task_id: taskId } },
          description: `Task "${updatedTask.description}" marked as finished.`
        }
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Error finishing task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
