import express from 'express';
import cors from 'cors';
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
app.use(express.json())

app.post('/user/signup', async (req, res, next) => {
	const { username, displayName, password, googleId, email } = req.body

	if (
		(username && typeof username !== 'string') ||
		(displayName && typeof displayName !== 'string') ||
		(password && typeof password !== 'string') ||
		(email && typeof email !== 'string') ||
		(googleId && typeof googleId !== 'string')
	) {
		return res.status(400).json({
			error: 'Each argument must be a string'
		})
	}

	if (
		username == null || displayName == null || email == null ||
		(googleId == null && password == null)
	) {
		return res.status(400).json({
			error: 'Missing argument (requires username, email, displayName, and either googleId or password)'
		})
	}

	let user = await prisma.account.findFirst({
		where: { username },
		select: { id: true }
	})

	if (user != null) {
		return res.status(409).json({ error: 'Username is taken' })
	}

	user = await prisma.account.findFirst({
		where: { email },
		select: { id: true }
	})

	if (user != null) {
		return res.status(409).json({ error: 'Account with email exists' })
	}

	user = await prisma.account.create({
		data: {
			username: username,
			name: displayName,
			email: email,
			...(password ? { password } : {}),
			...(googleId ? { googleId } : {}),
		}
	})

	let ret = { userId: user.id, error: '' }
	return res.status(201).json(ret)
})

app.post('/user/login', async (req, res, next) => {
	const { username, password, email, googleId } = req.body

	if (
		(username && typeof username !== 'string') ||
		(password && typeof password !== 'string') ||
		(email && typeof email !== 'string') ||
		(googleId && typeof googleId !== 'string')
	) {
		return res.status(400).json({
			error: 'username, password, email, and googleId must be a string'
		})
	}

	if ((username == null && email == null) || (googleId == null && password == null)) {
		return res.status(400).json({
			error: 'Missing argument (requires either username or email, and either googleId or password)'
		})
	}

	let user = await prisma.account.findFirst({
		where: {
			...(username ? { username } : {}),
			...(email ? { email } : {}),
			...(password ? { password } : {}),
			...(googleId ? { googleId } : {}),
		},
		select: { id: true }
	})

	if (user == null) {
		return res.status(401).json({ error: 'Incorrect Username or Password' })
	}

	let ret = { userId: user.id, error: '' }
	return res.status(200).json(ret)
})


app.get('/recipe/search', async (req, res, next) =>{

	const{
		name,
		filter
	} = req.body

	if(name == null && filer == null){
		return res.status(400).json({
			error: 'Missing argument (requires name or filter)'
		})
	}
	if(
	(name && typeof name != 'string')
	&&
	(filter && typeof filter != 'object')
	(filter[0] && typeof filter[0] != 'string')
	){

	}
})

app.post('/recipe/create', async (req, res, next) => {
	//   //Create recipe in database and return recipeId.
	
	//   //incoming name, desc, image, macroTrack, authorId, instructions, ingredients, tagId
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
		if (name == null || desc == null || image == null || macroTrack == null || authorId == null) {
			return res.status(400).json({
				error: 'Missing argument (requires name, desc, image, macroTrack & authorId)'
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
				error: 'Name, desc and authorId must be strings.\n MacroTrack must be an array of floats.'
			})
		}
		if((
		(tagId && typeof tagId != 'object') ||
		(ingredients[0] && typeof ingredients[0] != 'string') ||
		(tagId[0] && typeof tagId[0] != 'string'))){

		}
		if(instructions != null){
			if((instructions && typeof instructions != 'object') ||
			(instructions[0] && typeof instructions[0] != 'string')){
				return res.status(400).json({
					error: 'Instructions must be an array of strings'
				})
			}
		}
		if(ingredients != null){
			if((ingredients && typeof ingredients != 'object') ||
			(ingredients[0] && typeof ingredients[0] != 'string')){
				return res.status(400).json({
					error: 'Ingredients must be an array of strings'
				})
			}
		}
		if(tagId != null){
			if((tagId && typeof tagId != 'object') ||
			(tagId[0] && typeof tagId[0] != 'string')){
				return res.status(400).json({
					error: 'tagId must be an array of strings'
				})
			}
		}
		
		if(macroTrack.length != 4){
			return res.status(400).json({
				error: 'Marco Array missing parameter [Must Be 4 Floats]'
			})
		}
		let recipe = await prisma.recipe.create({
			data:{
				name: name,
				desc: desc,
				image : image,
				macroTrack: macroTrack,
				authorId: authorId,
				...(instructions ? {instructions} : {}),
				...(ingredients ? {ingredients} : {}),
				...(tagId ? { tagId } : {})
			}
		})
	
		let ret = {recipeId: recipe.id, error: ''}
		return res.status(200).json(ret)
})

export default app;

// // //GetProfile
// app.post('/api/getProfile', async(req, res, next) =>{
   
//     var error = ''
//   const { userId } = req.body
//   const input = req.body

//   //If any missing, return 204
//   if (userId == null) {
//     const er = { error: 'No Content' }
//     console.log(er)
//     return res.status(204).json(er)
//   }
//   //Search database for users with username and password. If so, return UserID
//   try {
//     await client.connect()
//     const db = client.db('COP4331LargeProjectDatabase');
//     const collection = db.collection('account');
//     var tempId = new ObjectId(userId);
//     const cursor = collection.find({_id:tempId});
//     //const cursor = collection.find({});
//     const result = await cursor.toArray();

//     if (result.length > 0) {
//       var ret = {   
//                 name: result[0].name, 
//                 desc: result[0].desc,
//                 image: result[0].image,
//                 username: result[0].username,
//                 recipesId: result[0].recipesId,
//                 filterId: result[0].filterId,
//                 }
//       return res.status(200).json(ret)
//     }
//   } finally {
//     await client.close()
//   }
//   return res.status(409).send('invalid search')
// })


// // //UpdateProfile
// app.post('/api/updateProfile', async(req, res, next) =>{
   
//     var error = ''
//   const { userId, username, name, image, desc } = req.body
//   const input = req.body

//   //If any missing, return 204
//   if (userId == null) {
//     const er = { error: 'No ID' }
//     return res.status(204).json(er)
//   }
//   //Search database for users with username and password. If so, return UserID
//   try {
//     await client.connect()
//     const db = client.db('COP4331LargeProjectDatabase');
//     const collection = db.collection('account');
//     var tempId = new ObjectId(userId);
    
//     if(image == null){

//         await collection.updateOne({_id:tempId},{ 
//             $set:{
//                 name: name,
//                 desc: desc,
//                 username: username
//             }
//         });
//     }
//     else{
//         await collection.updateOne({_id:tempId},{ 
//             $set:{
//                 name: name,
//                 desc: desc,
//                 image: image,
//                 username: username
//             }
//         });
//     }

//     res.status(200)
//   } finally {
//     await client.close()
//   }
//   return res.status(409).send('Username or Password Wrong')
// })

// // //DeleteProfile

// // //Search Profile

// // //Search Tag

// // //CreateTag

// // //Get Macros

// // //Create Recipe

// // //Update Recipe

// // //Delete Recipe

// // //Generate PDF

// // //UpdateProfile (Bobby)

// // //DeleteProfile (Bobby)

// // //Search Profile (Bobby)

// // //Search Tag (Fred)
// app.post('/api/searchTag', async (req, res, next) => {
//   // incoming: username, password
//   // outgoing: id, error
//   const { name, color } = req.body

//   //If any missing, return 204
//   if (name == null && color == null) {
//     const er = { error: 'No Content' }
//     console.log(er)
//     return res.status(204).json(er)
//   }
//   //Search database for users with username and password. If so, return UserID
//   try {
//     await client.connect()
//     const db = client.db('COP4331LargeProjectDatabase')
//     const collection = db.collection('tag')
//     const cursor = collection.find({ color: color }, { name: name })
//     if (name == null) {
//       //Search for tagId
//       const cursor = collection.find({ color: color })
//       const result = await cursor.toArray()
//       //Use tagId to search recipes and retunr array of recipes
//       const collection2 = db.collection('recipe')
//       const cursor2 = collection2.find({ tagId: result[0]._id })
//       result2 = await cursor2.toArray()
//       return res.status(200).json(result2)
//     } else if (color == null) {
//       //Search for tagId
//       const cursor = collection.find({ name: name })
//       const result = await cursor.toArray()
//       //Use tagId to search recipes and retunr array of recipes
//       const collection2 = db.collection('recipe')
//       const cursor2 = collection2.find({ tagId: result[0]._id })
//       result2 = await cursor2.toArray()
//       return res.status(200).json(result2)
//     } else {
//       //Search for tagId
//       const cursor = collection.find({ color: color }, { name: name })
//       const result = await cursor.toArray()
//       //Use tagId to search recipes and retunr array of recipes
//       const collection2 = db.collection('recipe')
//       const cursor2 = collection2.find({ tagId: result[0]._id })
//       result2 = await cursor2.toArray()
//       return res.status(200).json(result2)
//     }
//   } finally {
//     await client.close()
//   }
//   return res.status(409).send('')
// })

// // //CreateTag (Fred)
// app.post('/api/createTag', async (req, res, next) => {
//   //Create tag in database and return nothing

//   //incoming username, display name, password, googleID, email
//   const { name, color } = req.body
//   const input = req.body

//   //If any missing, return 204
//   if (name == null && color == null) {
//     const er = { error: 'No Content' }
//     console.log(er)
//     return res.status(204).send('No Content')
//   }

//   const newTag = {
//     name: name,
//     color: color
//   }

//   try {
//     await client.connect()

//     const db = client.db('COP4331LargeProjectDatabase')
//     const collection = db.collection('tag')
//     const cursor = collection.find({ color: color }, { name: name })
//     const result = await cursor.toArray()
//     if (result.length > 0) {
//       return res.status(409).json('Tag Exists')
//     }
//   } finally {
//     await client.close()
//   }

//   try {
//     await client.connect()
//     const db = client.db('COP4331LargeProjectDatabase')
//     const collection = db.collection('tag')

//     const result = await collection.insertOne(newTag)
//     const id = result.insertedId
//     console.log(id)
//     var ret = { tagId: id, error: '' }
//     //return res.status(200).json(ret)
//     return res.status(200)
//   } finally {
//     client.close()
//   }
// })
// // //Get Macros (Bobby)

// // //Create Recipe (Fred)
// app.post('/api/createRecipe', async (req, res, next) => {
//   //Create recipe in database and return recipeId.

//   //incoming username, display name, password, googleID, email
//   const {
//     name,
//     desc,
//     image,
//     macroTrack,
//     authorId,
//     instructions,
//     ingredients,
//     tagId
//   } = req.body
//   const input = req.body

//   //If any missing, return 204
//   if (name == null || authorId == null) {
//     const er = { error: 'No Content' }
//     console.log(er)
//     return res.status(204).send('No Content')
//   }

//   const newTag = {
//     name: name,
//     color: color
//   }

//   try {
//     await client.connect()

//     const db = client.db('COP4331LargeProjectDatabase')
//     const collection = db.collection('tag')
//     const cursor = collection.find({ color: color }, { name: name })
//     const result = await cursor.toArray()
//     if (result.length > 0) {
//       return res.status(409).json('Tag Exists')
//     }
//   } finally {
//     await client.close()
//   }

//   try {
//     await client.connect()
//     const db = client.db('COP4331LargeProjectDatabase')
//     const collection = db.collection('tag')

//     const result = await collection.insertOne(newTag)
//     const id = result.insertedId
//     console.log(id)
//     var ret = { tagId: id, error: '' }
//     //return res.status(200).json(ret)
//     return res.status(200)
//   } finally {
//     client.close()
//   }
// })
// // //Update Recipe (Fred)

// // //Delete Recipe (Fred)

// // //Generate PDF (Bobby)
