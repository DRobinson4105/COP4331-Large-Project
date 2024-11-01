import dotenv from 'dotenv'
import express from 'express';
import { MongoClient , ObjectId } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';
import {PrismaClient} from '@prisma/client'

dotenv.config({ path: '../../.env' })

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.SERVER_PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.set('port', PORT)

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, OPTIONS'
	)
	next()
})

app.get('/', (req, res) => {
  	res.send('Server Is Ready')
})

app.listen(PORT, () => {
  	console.log('Server listening on port ' + PORT + '\n')
})

app.use(express.json())

app.get('/status', async (req, res, next) => {
  return res.status(200).send('Server is On\n')
})

app.post('/api/login', async (req, res, next) => {
	const { username, password, email, googleId } = req.body

	if ((username == null && email == null) || (googleId == null && password == null)) {
		return res.status(200).json({
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
		return res.status(200).json({ error: 'Incorrect Username or Password' })
	}

	let ret = { UserID: user.id, error: '' }
	return res.status(200).json(ret)
})

app.post('/api/signup', async (req, res, next) => {
	const { username, display_name, password, googleId, email } = req.body

	if (
		username == null || display_name == null || email == null ||
		(googleId == null && password == null)
	) {
		return res.status(200).json({
			error: 'Missing argument (requires username, email, display_name, and either googleId or password)'
		})
	}

	let user = await prisma.account.findFirst({
		where: { username },
		select: { id: true }
	})

	if (user != null) {
		return res.status(200).json({ error: 'Username is taken' })
	}

	user = await prisma.account.findFirst({
		where: { email },
		select: { id: true }
	})

	if (user != null) {
		return res.status(200).json({ error: 'Account with email exists' })
	}

	user = await prisma.account.create({
		data: {
			username: username,
			name: display_name,
			email: email,
			...(password ? { password } : {}),
			...(googleId ? { googleId } : {}),
		}
	})

	let ret = { UserID: user.id, error: '' }
	return res.status(200).json(ret)
})

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
