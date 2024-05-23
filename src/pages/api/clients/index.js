// api/client/index.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function insertClient(name, telephone_number, id) {
    try {
      const newClient = await prisma.client.create({
        data: {
          id: id, 
          name: name,
          telephone_number: telephone_number
        }
      });
      console.log("New client added:", newClient); 
      return newClient;
    } catch (error) {
      console.error("Error inserting client:", error);
      throw new Error('Error inserting client');
    }
  }

export default async function handler(req, res) {
  console.log("Received request:", req.method, req.body);

  if (req.method === 'GET') {
    try {
      const clients = await prisma.client.findMany();
      console.log("Fetched clients:", clients);
      res.status(200).json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: 'Error fetching clients' });
    }
  } else if (req.method === 'POST') {
    const { name, telephone_number } = req.body;
    console.log("Add client request body:", { name, telephone_number }); 

    // Ensure telephone_number is an integer
    const phoneNumber = parseInt(telephone_number, 10);
    if (isNaN(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid telephone_number: Must be an integer' });
    }

    try {
      const newClient = await insertClient(name, phoneNumber);
      res.status(201).json(newClient);
    } catch (error) {
      console.error("Error adding client:", error);
      res.status(500).json({ error: 'Error adding client' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}