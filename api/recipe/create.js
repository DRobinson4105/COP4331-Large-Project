import { PrismaClient } from '@prisma/client';
import { Binary } from 'mongodb';

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
            calories,
			fat,
			carbs,
			protein,
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
            calories == null ||
            fat == null ||
            carbs == null ||
            protein == null ||
            authorId == null ||
            ingredients == null ||
            instructions == null
        ) {
            return res.status(400).json({
            error:
                'Missing argument (requires name, desc, image, macroTrack, ingredients, instructions & authorId)'
            })
        }
        
        if (
            (name && typeof name !== 'string') ||
            (desc && typeof desc !== 'string') ||
            (image && typeof image !== 'string') || //arrays return object
            (calories && typeof calories !== 'number') ||
            (fat && typeof fat !== 'number') ||
            (carbs && typeof carbs !== 'number') ||
            (protien && typeof protein !== 'number') ||
            (authorId && typeof authorId !== 'string')
        ) {
            return res.status(400).json({
            error:
                'Name, desc and authorId must be strings.\n Macros must be an array of floats.'
            })
        }
        if(Array.isArray(instructions) && instructions.every(item => typeof item !== 'string')){
            return res.status(400).json({
                error:
                    'Instructions must be an array of strings'
                })
        }
        if(Array.isArray(ingredients) && ingredients.every(item => typeof item !== 'string')){
            return res.status(400).json({
                error:
                    'Ingredients must be an array of strings'
                })
        }
       

        //Image code, unsure on which one to use
        let image64 = btoa(image);
        let imageBin = Binary.createFromBase64(image);
        let imageData = Binary.createFromBase64(image);
        let test = imageData.toJSON();

        
        let recipe = await prisma.recipe.create({
            data: {
            name: name,
            desc: desc,
            image: test,
            calories: calories,
            fat: fat,
            carbs: carbs,
            protein: protein,
            authorId: authorId,
            instructions: instructions,
            ingredients: ingredients,
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