import { PrismaClient } from '@prisma/client'
import { Binary } from 'mongodb'
import fs from 'fs'
import path, { parse } from 'path'

const prisma = new PrismaClient()

export default async function handler (req, res) {
	try {
		const {
			name, desc, image, calories, fat, carbs, protein, 
			authorId, instructions, ingredients, tagId
		} = req.body

		if (
			name == null || desc == null || authorId == null || instructions == null ||
			ingredients == null || tagId == null
		) {
			return res.status(400).json({
				error:
				'Missing argument (requires name, desc, ingredients, instructions, authorId, and tagId)'
			})
		}

    if(
      calories == null || fat == null || carbs == null ||
			protein == null
    ){
			return res.status(400).json({
				error:
				'Missing argument (calories, fat, carbs, protein)'
			})
		}

		if (image) {
			if (typeof image !== 'string') {
				return res.status(400).json({
					error: 'image must be a string'
				})
			}
			try {
				var imageBuffer = Buffer.from(image, 'base64')
			} catch (error){
				return res.status(400).json({
					error: 'Error occurred with image processing. Not valid image.'
				})
			}
		}

		if (
			typeof name !== 'string' || typeof desc !== 'string' || typeof authorId !== 'string'
		) {
			return res.status(400).json({
				error: 'name, desc and authorId must be strings.'
			})
		}

		if (
			typeof calories !== 'number' || typeof fat !== 'number' ||
			typeof carbs !== 'number' || typeof protein !== 'number'
		) {
			return res.status(400).json({
				error: 'calories, fat, carbs, and protein must be numbers.'
			})
		}

		if (
			!Array.isArray(instructions) ||
			instructions.every(item => typeof item !== 'string')
		) {
			return res.status(400).json({
				error: 'Instructions must be an array of strings'
			})
		}
		if (
			!Array.isArray(ingredients) ||
			ingredients.every(item => typeof item !== 'string')
		) {
			return res.status(400).json({
				error: 'Ingredients must be an array of strings'
			})
		}
		if (
			!Array.isArray(tagId) ||
			ingredients.every(item => typeof item !== 'string')
		) {
			return res.status(400).json({
				error: 'tagId must be an array of strings'
			})
		}

		let recipe = await prisma.recipe.create({
			data: {
				name,
				desc,
				...(imageBuffer ? { image: imageBuffer } : {}),
				calories,
				fat,
				carbs,
				protein,
				authorId,
				instructions,
				ingredients,
				tagId
			}
		})

		res.setHeader('Content-Type', 'application/json')
		return res.status(200).json({ id: recipe.id, error: '' })
	} catch (error) {
		console.error('Error: ', error)
		res.setHeader('Content-Type', 'application/json')
		return res.status(500).json({ error: "Error during create recipe" + error.message })
	} finally {
		await prisma.$disconnect()
	}
}
