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
        const { name, filters } = req.body
        let recipeList = null

        if (name == null && filters == null) {
            return res.status(400).json({
            error: 'Missing argument (requires name or filters)'
            })
        }
        if (name != null) {
            if (name && typeof name != 'string') {
            return res.status(400).json({
                error: 'Name must be a string'
            })
            }
        }
        if (filters != null) {
            if (filters && typeof filters != 'object') {
            return res.status(400).json({
                error: 'Filters must be an array of strings'
            })
            }
            if (filters[0] && typeof filters[0] != 'string') {
            return res.status(400).json({
                error: 'Filters must be an array of strings'
            })
            }
        }

            if (name == null) {
            recipeList = await prisma.recipe.findMany({
            where: {
                tagId: { hasSome: filters}
            }
            })
            } else if(filters == null){
            recipeList = await prisma.recipe.findMany({
                where: {
                name: { contains: name }
                }
            })
            }
            else {
            recipeList = await prisma.recipe.findMany({
            where: {
                name: { contains: name },
                tagId: { hasSome: filters}
            }
            })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(recipeList)
    } catch (error) {
        console.error('Error during signup:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}