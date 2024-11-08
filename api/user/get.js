import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const { id } = req.body

        if(id == null){
            return res.status(400).json({
                error: 'Input must contain an id input'
            })
        }

        if (
            (id && typeof id !== 'string')
        ) {
            return res.status(400).json({
            error: 'Entered id must be a string'
            })
        }

        let user = await prisma.account.findFirst({
            where: {
            ...(id ? { id } : {})
            }
        })

        if (user == null) {
            return res.status(409).json({ error: 'Account not found' })
        }

        let recipes = await prisma.recipe.findMany({
            where: {authorId: user.id},
            select: {id: true, name: true, image: true, desc: true, tagId: true}
        })

        if (user.image) {
            try{
                const base64Image = user.image.toString('base64')
                const mimeType = 'image/jpeg'
                var img = `data:${mimeType};base64,${base64Image}`
            } catch (error){
                return res.status(400).json(
                    {error: 'Error occured in image processing. Invalid image.'})
            }
        }

        for(let i=0; i < recipes.length;++i){

            if (recipes.at(i).image) {
                try{
                    const base64Image = recipes.at(i).image.toString('base64')
                    const mimeType = 'image/jpeg'
                    recipes.at(i).image = `data:${mimeType};base64,${base64Image}`
                } catch (error){
                    return res.status(400).json(
                        {error: 'Error occured in image processing. Invalid image.'})
                }
            }
        }

        let ret = { email: user.email, name: user.name, username: user.username, 
            ...(user.image ? { image: user.image } : {}), desc: user.desc, recipes: recipes, error: ''};
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(ret)
    } catch (error) {
        console.error('Error during getProfile:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}