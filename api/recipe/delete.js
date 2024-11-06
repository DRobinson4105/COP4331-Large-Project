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
        const { id } = req.body;

        if (id == null) {
            return res.status(400).json({
            error:
                'Missing argument (requires id)'
            })
        }

        let checker = await prisma.recipe.findFirst({
            where: {id: id}
        })

        if(checker == null){
            return res.status(409).json({ error: 'Recipe not found' })
        }
        
        await prisma.recipe.delete({
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