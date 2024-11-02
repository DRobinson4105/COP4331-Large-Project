import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, displayName, password, googleId, email } = req.body;

        let user = await prisma.account.findFirst({
            where: { username },
            select: { id: true }
        });

        if (user) {
            return res.status(409).json({ error: 'Username is taken' });
        }

        user = await prisma.account.create({
            data: {
                username,
                name: displayName,
                email,
                ...(password && { password }),
                ...(googleId && { googleId })
            }
        });

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ userId: user.id, error: '' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error });
    } finally {
        await prisma.$disconnect();
    }
}