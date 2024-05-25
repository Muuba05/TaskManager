import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const logs = await prisma.log.findMany({
        include: {
          task: {
            include: {
              staff: true,
              client: true,
            },
          },
        },
      });
      const logData = logs.map(log => ({
        log_id: log.log_id,
        task_id: log.task_id,
        description: log.description,
        created_date: log.created_date,
        // Assuming you want to extract staff and client information
        staff: log.task.staff ? {
          staff_id: log.task.staff.staff_id,
          // Add other staff properties
        } : null,
        client: log.task.client ? {
          client_id: log.task.client.client_id,
          // Add other client properties
        } : null,
      }));
      res.status(200).json(logData);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching logs' });
    }
  } else if (req.method === 'DELETE') {
    const logId = parseInt(req.query.logId, 10);
    
    try {
      await prisma.log.delete({
        where: { log_id: logId },
      });
      res.status(204).end(); // No content
    } catch (error) {
      res.status(500).json({ error: 'Error deleting log' });
    }
  } else {
    res.status(405).end(); // Method not allowed
  }
}