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
        const {
            name,
            desc,
            image,
            macroTrack,
            authorId,
            instructions,
            ingredients,
            tagId
        } = req.body
        
        //   //If any missing, return error
        if (
            name == null ||
            desc == null ||
            image == null ||
            macroTrack == null ||
            authorId == null
        ) {
            return res.status(400).json({
            error:
                'Missing argument (requires name, desc, image, macroTrack & authorId)'
            })
        }
        
        if (
            (name && typeof name !== 'string') ||
            (desc && typeof desc !== 'string') ||
            (image && typeof image !== 'string') || //arrays return object
            (macroTrack && typeof macroTrack != 'object') ||
            (authorId && typeof authorId !== 'string') ||
            (macroTrack[0] && typeof macroTrack[0] != 'number') //instructions/ingredients/tagId not necessary
        ) {
            return res.status(400).json({
            error:
                'Name, desc and authorId must be strings.\n MacroTrack must be an array of floats.'
            })
        }
        if (
            (tagId && typeof tagId != 'object') ||
            (ingredients[0] && typeof ingredients[0] != 'string') ||
            (tagId[0] && typeof tagId[0] != 'string')
        ) {
        }
        if (instructions != null) {
            if (
            (instructions && typeof instructions != 'object') ||
            (instructions[0] && typeof instructions[0] != 'string')
            ) {
            return res.status(400).json({
                error: 'Instructions must be an array of strings'
            })
            }
        }
        if (ingredients != null) {
            if (
            (ingredients && typeof ingredients != 'object') ||
            (ingredients[0] && typeof ingredients[0] != 'string')
            ) {
            return res.status(400).json({
                error: 'Ingredients must be an array of strings'
            })
            }
        }
        if (tagId != null) {
            if (
            (tagId && typeof tagId != 'object') ||
            (tagId[0] && typeof tagId[0] != 'string')
            ) {
            return res.status(400).json({
                error: 'tagId must be an array of strings'
            })
            }
        }
        
        if (macroTrack.length != 4) {
            return res.status(400).json({
            error: 'Marco Array missing parameter [Must Be 4 Floats]'
            })
        }
        let recipe = await prisma.recipe.create({
            data: {
            name: name,
            desc: desc,
            image: image,
            macroTrack: macroTrack,
            authorId: authorId,
            ...(instructions ? { instructions } : {}),
            ...(ingredients ? { ingredients } : {}),
            ...(tagId ? { tagId } : {})
            }
        })
        
        let ret = { recipeId: recipe.id, error: '' }
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