import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler (req, res) {
	try {
		const { name, 
			firstidx, lastidx,
			minCalories, maxCalories,
			minFat, maxFat,
			minCarbs, maxCarbs,
			minProtein, maxProtein,
			tagId
		} = req.body

		if (name == null) {
			return res.status(400).json({
				error: 'Missing argument (requires name)'
			})
		}
		

		if(minCalories == null){
			var nminCalories = 0;
		}
		else {
			var nminCalories = minCalories
		}
		if(maxCalories == null){
			var nmaxCalories = Number.MAX_VALUE
		}
		else {
			var nmaxCalories = maxCalories
		}
		if(minFat == null){
			var nminFat = 0;
		}
		else {
			var nminFat = minFat
		}
		if(maxFat == null){
			var nmaxFat = Number.MAX_VALUE
		}
		if(minCarbs == null){
			var nminCarbs = 0;
		}
		else {
			var nminCarbs = minCarbs
		}
		if(maxCarbs == null){
			var nmaxCarbs = Number.MAX_VALUE
		}
		else{
			var nmaxCarbs = maxCarbs
		}
		if(minProtein == null){
			var nminProtein = 0;
		}
		else {
			var nminProtein = minProtein
		}
		if(maxProtein == null){
			var nmaxProtein = Number.MAX_VALUE
		}
		else{
			var nmaxProtein = maxProtein
		}

		if (typeof name != 'string') {
			return res.status(400).json({
			error: 'Name must be a string'
			})
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


		if (tagId && tagId != null) {
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
	if(tagId){
    var recipeList = await prisma.recipe.findMany({
        where: {
            name: { contains: name },
            tagId: {
              equals: tagId
            },
            calories: {
                lte: nmaxCalories, 
                gte: nminCalories
            },
            fat: {
              lte: nmaxCalories, 
              gte: nminCalories
            },
            carbs: {
              lte: nmaxCalories, 
              gte: nminCalories
            },
            protein: {
              lte: nmaxCalories, 
              gte: nminCalories
            }
        },
        select:{
          name: true,
          desc: true,
          image: true,
          calories: true,
          fat: true,
          protein: true,
          authorId: true,
          instructions: true,
          ingredients: true,
          tagId: true
        }
        // if (image) {
        //   try{
        //       const base64Image = image.toString('base64')
        //       const mimeType = 'image/jpeg'
        //       var img = `data:${mimeType};base64,${base64Image}`
        //   } catch (error){
        //       return res.status(400).json(
        //           {error: 'Error occured in image processing. Invalid image.'})
        //   }

      	// }
      })
	}else{
		var recipeList = await prisma.recipe.findMany({
			where: {
				name: { contains: name },
				calories: {
					lte: nmaxCalories, 
					gte: nminCalories
				},
				fat: {
				  lte: nmaxCalories, 
				  gte: nminCalories
				},
				carbs: {
				  lte: nmaxCalories, 
				  gte: nminCalories
				},
				protein: {
				  lte: nmaxCalories, 
				  gte: nminCalories
				}
			},
			select:{
			  name: true,
			  desc: true,
			  image: true,
			  calories: true,
			  fat: true,
			  protein: true,
			  authorId: true,
			  instructions: true,
			  ingredients: true,
			  tagId: true
			}
		})
	}

	  	for(let i=0; i < recipeList.length;i++){

			if (recipeList.at(i).image) {
				try{
					const base64Image = Buffer.toString(recipeList.at(i).image, 'Base64')
					recipeList.at(i).image = base64Image;
				} catch (error){
					return res.status(500).json(
						{error: 'Error occured in image processing. Invalid image.'})
				}
			}
		}

    


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
