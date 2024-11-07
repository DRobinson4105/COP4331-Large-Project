import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const { username, password, email, googleId } = req.body

        if (
            (username && typeof username !== 'string') ||
            (password && typeof password !== 'string') ||
            (email && typeof email !== 'string') ||
            (googleId && typeof googleId !== 'string')
        ) {
            return res.status(400).json({
            error: 'username, password, email, and googleId must be a string'
            })
        }

        if (
            (username == null && email == null) ||
            (googleId == null && password == null)
        ) {
            return res.status(400).json({
                error: 'Missing argument (requires either username or email, and either googleId or password)'
            })
        }

        let user = await prisma.account.findFirst({
            where: {
            ...(username ? { username } : {}),
            ...(email ? { email } : {}),
            ...(password ? { password } : {}),
            ...(googleId ? { googleId } : {})
            },
            select: { id: true }
        })

        if (user == null) {
            return res.status(401).json({ error: 'Incorrect Username or Password' })
        }

        let ret = { userId: user.id, error: '' }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(ret)
    } catch (error) {
        console.error('Error during signup:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}