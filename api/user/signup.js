import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const { username, displayName, password, googleId, email } = req.body;

        if (
            (username && typeof username !== 'string') ||
            (displayName && typeof displayName !== 'string') ||
            (password && typeof password !== 'string') ||
            (email && typeof email !== 'string') ||
            (googleId && typeof googleId !== 'string')
        ) {
            return res.status(400).json({
            error: 'Each argument must be a string'
            })
        }
        
        if (
            username == null ||
            displayName == null ||
            email == null ||
            (googleId == null && password == null)
        ) {
            return res.status(400).json({
            error:
                'Missing argument (requires username, email, displayName, and either googleId or password)'
            })
        }
        
        let user = await prisma.account.findFirst({
            where: { username },
            select: { id: true }
        })
        
        if (user != null) {
            return res.status(409).json({ error: 'Username is taken' })
        }
        
        user = await prisma.account.findFirst({
            where: { email },
            select: { id: true }
        })
        
        if (user != null) {
            return res.status(409).json({ error: 'Account with email exists' })
        }
        
        user = await prisma.account.create({
            data: {
                username: username,
                name: displayName,
                email: email,
                ...(password ? { password } : {}),
                ...(googleId ? { googleId } : {})
            }
        })
        
        let ret = { userId: user.id, error: '' }
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json(ret)
    } catch (error) {
        console.error('Error during signup:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}