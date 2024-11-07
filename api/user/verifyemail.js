import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const { email } = req.body
	
        if (email == null) {
            return res.status(400).json({
                error: 'Missing email argument'
            })
        }

        if (typeof email !== 'string') {
            return res.status(400).json({
                error: 'email must be a string'
            })
        }

        let user = await prisma.account.findFirst({
            where: { email },
            select: { id: true }
        })

        let ret = { taken: user != null, error: '' }
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