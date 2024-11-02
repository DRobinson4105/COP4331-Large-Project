import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password, email, googleId } = req.body;

    let user = await prisma.account.findFirst({
        where: { ...(username && { username }), ...(email && { email }), ...(password && { password }), ...(googleId && { googleId }) },
        select: { id: true }
    });

    if (!user) {
        return res.status(401).json({ error: 'Incorrect Username or Password' });
    }

    return res.status(200).json({ userId: user.id, error: '' });
}