import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, displayName, password, googleId, email } = req.body;

    let user = await prisma.account.findFirst({
        where: { username },
        select: { id: true }
    });

    if (user) return res.status(409).json({ error: 'Username is taken' });

    user = await prisma.account.create({
        data: {
        username,
        name: displayName,
        email,
        ...(password && { password }),
        ...(googleId && { googleId })
        }
    });

    return res.status(201).json({ userId: user.id, error: '' });
}