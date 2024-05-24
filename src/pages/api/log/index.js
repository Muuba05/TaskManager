import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method == 'GET') {
        try {
            const log = await prisma.log.findMany();
            res.status(200).json(log);
        } catch(error) {
            res.status(500).json({ error: 'Error fetching clients'});
        }
    } else if (req.method === 'POST') {

    } else {
        res.status(405).end();
    }
}