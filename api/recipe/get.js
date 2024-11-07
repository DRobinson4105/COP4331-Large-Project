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
        const { id } = req.body
    
        if (id == null) {
            return res.status(400).json({
            error: 'Missing argument (id))'
            })
        }
        if (id && typeof id != 'string') {
            return res.status(400).json({
            error: 'id must be string'
            })
        }
        
        let recipe = await prisma.recipe.findFirst({
            where: {
            ...(id ? { id } : {})
            },
        })
        
        if (recipe == null) {
            return res.status(409).json({ error: 'Recipe not found' })
        }

        const { name, desc, image, calories, fat, carbs, protein, authorId, instructions, ingredients, tagId } = recipe

        if (image) {
            const base64Image = image.toString('base64')
            const mimeType = 'image/jpeg'
            var img = `data:${mimeType};base64,${base64Image}`
        }

        let ret = {
            name, desc, calories, fat, carbs, protein, authorId, instructions, ingredients, tagId,
            ...(img ? { image: img } : {})
        }
        
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(ret)
    } catch (error) {
        console.error('Error during retrieving recipe:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}