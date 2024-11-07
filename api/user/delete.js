import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const { id } = req.body;

        if (id == null) {
            return res.status(400).json({
            error:
                'Missing argument (requires id)'
            })
        }

        let checker = await prisma.account.findFirst({
            where: {id: id}
        })

        if(checker == null){
            return res.status(409).json({ error: 'Account not found' })
        }
        
        await prisma.account.delete({
            where: {id: id}
        })
    
        let ret = {  error: '' }
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