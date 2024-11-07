import { PrismaClient } from '@prisma/client'
import { Binary } from 'mongodb'
import fs from 'fs'
import path, { parse } from 'path'

const prisma = new PrismaClient()

export default async function handler (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
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
      authorId == null ||
      instructions == null ||
      ingredients == null
    ) {
      return res.status(400).json({
        error:
          'Missing argument (requires name, desc, ingredients, instructions & authorId)'
      })
    }

    if (calories == null || fat == null || carbs == null || protein == null) {
      return res.status(400).json({
        error: 'Missing argument (macros)'
      })
    }

    if (image && typeof image !== 'string') {
      return res.status(400).json({
        error: 'Invalid argument. Image must be a string'
      })
    }

    if (image) {
      var imageBuffer = Buffer.from(image, 'base64')
    }

    if (
      (name && typeof name !== 'string') ||
      (desc && typeof desc !== 'string') ||
      (authorId && typeof authorId !== 'string')
    ) {
      return res.status(400).json({
        error: 'Name, desc and authorId must be strings.'
      })
    }

    if (typeof calories !== 'number') {
      return res.status(400).json({
        error: 'Macros must be numbers.'
      })
    }
    if (typeof fat !== 'number') {
      return res.status(400).json({
        error: 'Macros must be numbers.'
      })
    }
    if (typeof carbs !== 'number') {
      return res.status(400).json({
        error: 'Macros must be numbers.'
      })
    }
    if (typeof protein !== 'number') {
      return res.status(400).json({
        error: 'Macros must be numbers.'
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
    if (tagId != null) {
      if (
        !Array.isArray(tagId) ||
        ingredients.every(item => typeof item !== 'string')
      ) {
        return res.status(400).json({
          error: 'tagId must be an array of strings'
        })
      }
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
        ...(tagId ? { tagId } : {})
      }
    })

    let ret = { id: recipe.id, error: '' }
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(ret)
  } catch (error) {
    console.error('Error during creating recipe:', error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
  }
}
