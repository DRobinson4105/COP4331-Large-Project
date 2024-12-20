import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler (req, res) {
  try {
    const {
      id,
      name,
      desc,
      image,
      calories,
      fat,
      carbs,
      protein,
      instructions,
      ingredients,
      tagId
    } = req.body

    if (id == null) {
      return res.status(400).json({
        error: 'Missing argument (requires id)'
      })
    }
    //Type checking
    if (
    (id && typeof id !== 'string') ||
      (name && typeof name !== 'string' && name != null) ||
      
      (desc && typeof desc !== 'string' && desc != null) ||
      (image && typeof image !== 'string' && image != null)
    ) {
      return res.status(400).json({
        error: 'Each argument must be a string or empty'
      })
    }
    if (calories && typeof calories !== 'number') {
      return res.status(400).json({
        error: 'Macros must be numbers.'
      })
    }
    if (fat && typeof fat !== 'number') {
      return res.status(400).json({
        error: 'Macros must be numbers.'
      })
    }
    if (carbs && typeof carbs !== 'number') {
      return res.status(400).json({
        error: 'Macros must be numbers.'
      })
    }
    if (protein && typeof protein !== 'number') {
      return res.status(400).json({
        error: 'Macros must be numbers.'
      })
    }
    if (
      instructions && (!Array.isArray(instructions) ||
      instructions.every(item => typeof item !== 'string'))
    ) {
      return res.status(400).json({
        error: 'Instructions must be an array of strings'
      })
    }
    if (
      ingredients && (!Array.isArray(ingredients) ||
      ingredients.every(item => typeof item !== 'string'))
    ) {
      return res.status(400).json({
        error: 'Ingredients must be an array of strings'
      })
    }
    if (tagId != null) {
      if (
        tagId && (tagId.length != 0) && (!Array.isArray(tagId) ||
        tagId.every(item => typeof item !== 'string'))
      ) {
        return res.status(400).json({
          error: 'tagId must be an array of strings'
        })
      }
      tagId.forEach(tag => {
        let check = async () => {
          let exists = await prisma.tag.findFirst({
            where: {name: tag}
          })
          if (exists == null) {
            await prisma.tag.create({
              data: {
                name: tag
              }
            })
          }
        }
        check()
      })
    }

    let checker = await prisma.recipe.findFirst({
      where: { id: id }
    })

    if (checker == null) {
      return res.status(409).json({ error: 'Recipe not found' })
    }

    if (image) {
        try{
          var imageBuffer = Buffer.from(image, 'base64')
        } catch (error){
          return res.status(400).json({
            error: 'Error occured with image processing. Not valid image.'
          })
        }
      }

    let updated = await prisma.recipe.update({
      where: {
        id: id
      },
      data: {
        ...(name ? { name } : {}),
        ...(imageBuffer ? { image: imageBuffer } : {}),
        ...(desc ? { desc } : {}),
        ...(calories ? {calories} : {}),
        ...(fat ? { fat } : {}),
        ...(carbs ? { carbs } : {}),
        ...(protein ? { protein } : {}),
        ...(instructions ? { instructions } : {}),
        ...(ingredients ? { ingredients } : {}),
        ...(tagId ? { tagId } : {})
      }
    })

    if (updated == null) {
      return res.status(409).json({ error: 'Recipe not found' })
    }
    

    let ret = { error: '' }
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(ret)
  } catch (error) {
    
    console.error('Error during update Recipe:', error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ error: "Error during update recipe" + error.message })
  } finally {
    await prisma.$disconnect()
  }
}
