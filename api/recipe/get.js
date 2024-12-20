import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const { id } = req.body
    
        if (id == null) {
            return res.status(400).json({
                error: 'Missing argument (id))'
            })
        }

        if (typeof id != 'string') {
            return res.status(400).json({
            error: 'id must be string'
            })
        }

        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
            return res.status(404).json({ error: 'Recipe not found' })
        }
      
        let recipe = await prisma.recipe.findFirst({
            where: {
                id
            }
        })
        
        if (recipe == null) {
            return res.status(404).json({ error: 'Recipe not found' })
        }

        const { name, desc, image, calories, fat, carbs, protein, authorId, instructions, ingredients, tagId } = recipe

        if (image) {
            try{
                const base64Image = image.toString('base64')
                const mimeType = 'image/jpeg'
                var img = `data:${mimeType};base64,${base64Image}`
            } catch (error){
                return res.status(400).json(
                    {error: 'Error occured in image processing. Invalid image.'})
            }
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
        return res.status(500).json({ error: "Error during get recipe" + error.message });
    } finally {
        await prisma.$disconnect();
    }
}