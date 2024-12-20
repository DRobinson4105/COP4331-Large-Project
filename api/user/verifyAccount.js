import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const { id, code } = req.body
	
        if (id == null || code == null) {
            return res.status(400).json({
                error: 'Invalid account'
            })
        }

        if (typeof id !== 'string' || typeof code !== 'string') {
            return res.status(400).json({
                error: 'Invalid account'
            })
        }

        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            return res.status(400).json({ error: 'Invalid account' })
        }

        let user = await prisma.account.findFirst({
            where: { id },
            select: { id: true, username: true, verifyCode: true }
        })

        if (code != user.verifyCode) {
            return res.status(400).json({
                error: 'Invalid account'
            })
        }

        let updated = await prisma.account.update({
            where: {
                id: id
            },
            data: {
                verified: true
            }
        })

        if (updated == null) {
            return res.status(400).json({
                error: 'Invalid account'
            })
        }

        let ret = { error: 'Account validated' }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(ret)
    } catch (error) {
        console.error('Error during signup:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: 'Invalid account' });
    } finally {
        await prisma.$disconnect();
    }
}