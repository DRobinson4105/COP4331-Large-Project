import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.body

        if(id == null){
            return res.status(400).json({
                error: 'Input must contain an id input'
            })
        }

        if (
            (id && typeof id !== 'string')
        ) {
            return res.status(400).json({
            error: 'Entered id must be a string'
            })
        }

        let user = await prisma.account.findFirst({
            where: {
            ...(id ? { id } : {})
            }
        })

        if (user == null) {
            return res.status(409).json({ error: 'Account not found' })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(user)
    } catch (error) {
        console.error('Error during getProfile:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error });
    } finally {
        await prisma.$disconnect();
    }
}