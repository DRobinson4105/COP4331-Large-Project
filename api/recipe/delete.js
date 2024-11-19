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

        let checker = await prisma.recipe.findFirst({
            where: {id: id}
        })

        if (checker == null) {
            return res.status(409).json({ error: 'Recipe not found' })
        }
        
        await prisma.recipe.delete({
            where: {id: id}
        })
    
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ error: '' })
    } catch (error) {
        console.error('Error during delete recipe:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: "Error during delete recipe" + error.message });
    } finally {
        await prisma.$disconnect();
    }
}