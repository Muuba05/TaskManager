import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function insertStaff(name, id) {
  try {
    const newStaff = await prisma.staff.create({
      data: {
        name: name,
        staff_id: id
      }
    });
    console.log("New staff added:", newStaff); // Log added staff
    return newStaff;
  } catch (error) {
    console.error("Error inserting staff:", error);
    throw new Error('Error inserting staff');
  }
}

export default async function handler(req, res) {
  console.log("Received request:", req.method, req.body); // Log request method and body

  if (req.method === 'GET') {
    try {
      const staff = await prisma.staff.findMany();
      console.log("Fetched staff:", staff); // Log fetched staff
      res.status(200).json(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ error: 'Error fetching staff' });
    }
  } else if (req.method === 'POST') {
    const { name, id } = req.body;
    console.log("Add staff request body:", { name, id }); // Log request body

    // Ensure id is an integer
    const staffId = parseInt(id, 10);
    if (isNaN(staffId)) {
      return res.status(400).json({ error: 'Invalid staff_id: Must be an integer' });
    }

    try {
      const newStaff = await insertStaff(name, staffId);
      res.status(201).json(newStaff); // Send the newly added staff member in the response
    } catch (error) {
      console.error("Error adding staff:", error);
      res.status(500).json({ error: 'Error adding staff' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
