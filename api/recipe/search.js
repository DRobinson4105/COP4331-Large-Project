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
    const { name, 
      firstidx, lastidx,
      minCalories, maxCalories,
      minFat, maxFat,
      minCarbs, maxCarbs,
      minProtein, maxProtein,
      tagId } = req.body

    let recipeList = null;

    if (name == null || tagId == null 
    ) {
      return res.status(400).json({
        error: 'Missing argument (requires name & tagId)'
      })
    }

    if(minCalories == null || maxCalories == null){
      return res.status(400).json({
        error: 'Missing argument (requires min/max Calories)'
      })
    }
    if(minFat == null || maxFat == null){
      return res.status(400).json({
        error: 'Missing argument (requires min/max Fat)'
      })
    }
    if(minCarbs== null ||  maxCarbs == null){
      return res.status(400).json({
        error: 'Missing argument (requires min/max Carbs)'
      })
    }
    if(minProtein == null ||  maxProtein == null){
      return res.status(400).json({
        error: 'Missing argument (requires min/max Protein)'
      })
    }

    if (name != null) {
      if (name && typeof name != 'string') {
        return res.status(400).json({
          error: 'Name must be a string'
        })
      }
    }

    if(minCalories && typeof minCalories != 'number'){
      return res.status(400).json({
        error: 'minCalories must be a number'
      })
    }
    if(maxCalories && typeof maxCalories != 'number'){
      return res.status(400).json({
        error: 'maxCalories must be a number'
      })
    }

    if(minFat && typeof minFat != 'number'){
      return res.status(400).json({
        error: 'minFat must be a number'
      })
    }
    if(maxFat && typeof maxFat != 'number'){
      return res.status(400).json({
        error: 'maxCalories must be a number'
      })
    }

    if(minCarbs && typeof minCarbs != 'number'){
      return res.status(400).json({
        error: 'minCarbs must be a number'
      })
    }
    if(maxCarbs && typeof maxCarbs != 'number'){
      return res.status(400).json({
        error: 'maxCarbs must be a number'
      })
    }

    if(minProtein && typeof minProtein != 'number'){
      return res.status(400).json({
        error: 'minProtein must be a number'
      })
    }
    if(maxProtein && typeof maxProtein != 'number'){
      return res.status(400).json({
        error: 'maxProtein must be a number'
      })
    }


    if (tagId != null) {
      if (
        !Array.isArray(tagId) ||
        tagId.every(item => typeof item !== 'string')
      ) {
        return res.status(400).json({
          error: 'tagId must be an array of strings'
        })
      }
    }



    //Change to different macros and search using that
    recipeList = await prisma.recipe.findMany({
        where: {
            name: { contains: name },
            tagId: {
              equals: tagId
            },
            calories: {
                lte: maxCalories, 
                gte: minCalories
            },
            fat: {
              lte: maxCalories, 
              gte: minCalories
            },
            carbs: {
              lte: maxCalories, 
              gte: minCalories
            },
            protein: {
              lte: maxCalories, 
              gte: minCalories
            }
        }
      })
    

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(recipeList)
  } catch (error) {
    console.error('Error during searching recipe: ', error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
  }
}
