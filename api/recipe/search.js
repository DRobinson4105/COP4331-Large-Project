import { PrismaClient } from '@prisma/client'

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
    const { name, min, tags } = req.body
    let recipeList = null;

    if (
      name == null ||
      marcoTrack == null ||
      tags == null ||
      minMacroTrack == null ||
      maxMacroTrack == null
    ) {
      return res.status(400).json({
        error: 'Missing argument (requires name, macroTrack & tags)'
      })
    }
    if (name != null) {
      if (name && typeof name != 'string') {
        return res.status(400).json({
          error: 'Name must be a string'
        })
      }
    }
    if (tags != null) {
      if (
        !Array.isArray(tags) ||
        tags.every(item => typeof item !== 'string')
      ) {
        return res.status(400).json({
          error: 'Tags must be an array of strings'
        })
      }
    }
    // if (macroTrack != null) {
    //     if (
    //       !Array.isArray(macroTrack) ||
    //       tags.every(item => typeof item !== 'number')
    //     ) {
    //       return res.status(400).json({
    //         error: 'macroTrack must be an array of floats'
    //       })
    //     }
    // }
    if (minMacroTrack != null) {
        if (
          !Array.isArray(minMacroTrack) ||
          tags.every(item => typeof item !== 'number')
        ) {
          return res.status(400).json({
            error: 'maxMacroTrack must be an array of floats'
          })
        }
    }
    if (maxMacroTrack != null) {
        if (
          !Array.isArray(maxMacroTrack) ||
          tags.every(item => typeof item !== 'number')
        ) {
          return res.status(400).json({
            error: 'maxMacroTrack must be an array of floats'
          })
        }
    }


    //Change to different macros and search using that
    recipeList = await prisma.recipe.findMany({
        where: {
            name: { contains: name },
            tagId: { contains: tags },
            macroTrack[0]: {
                lte: maxMacroTrack[0], 
                gte: minMacroTrack[0]
            }
        }
      })
    

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(recipeList)
  } catch (error) {
    console.error('Error during signup:', error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
  }
}
