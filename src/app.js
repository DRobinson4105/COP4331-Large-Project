import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization'
    ]
  })
)
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
    username == null ||
    displayName == null ||
    email == null ||
    (googleId == null && password == null)
  ) {
    return res.status(400).json({
      error:
        'Missing argument (requires username, email, displayName, and either googleId or password)'
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
      ...(googleId ? { googleId } : {})
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

  if (
    (username == null && email == null) ||
    (googleId == null && password == null)
  ) {
    return res.status(400).json({
      error:
        'Missing argument (requires either username or email, and either googleId or password)'
    })
  }

  let user = await prisma.account.findFirst({
    where: {
      ...(username ? { username } : {}),
      ...(email ? { email } : {}),
      ...(password ? { password } : {}),
      ...(googleId ? { googleId } : {})
    },
    select: { id: true }
  })

  if (user == null) {
    return res.status(401).json({ error: 'Incorrect Username or Password' })
  }

  let ret = { userId: user.id, error: '' }
  return res.status(200).json(ret)
})

app.post('/user/verifyemail', async (req, res, next) => {
	const { email } = req.body
	
	if (email == null) {
		return res.status(400).json({
			error: 'Missing email argument'
		})
	}

	if (typeof email !== 'string') {
		return res.status(400).json({
			error: 'email must be a string'
		})
	}

	let user = await prisma.account.findFirst({
		where: { email },
		select: { id: true }
	})

	let ret = { taken: user != null, error: '' }
	return res.status(200).json(ret)
})

app.get('/recipe', async (req, res, next) =>{
	const{
		id
	} = req.body

  if (id == null) {
    return res.status(400).json({
      error: 'Missing argument (id))'
    })
  }
  if (id && typeof id != 'string') {
    return res.status(400).json({
      error: 'id must be string'
    })
  }

  let recipe = await prisma.recipe.findFirst({
    where: {
      ...(id ? { id } : {})
    }
  })

  if (recipe == null) {
    return res.status(409).json({ error: 'Recipe not found' })
  }

  return res.status(200).json(recipe)
})

app.get('/recipe/search', async (req, res, next) => {
  const { name, filters } = req.body
  let recipeList = null

  if (name == null && filters == null) {
    return res.status(400).json({
      error: 'Missing argument (requires name or filters)'
    })
  }
  if (name != null) {
    if (name && typeof name != 'string') {
      return res.status(400).json({
        error: 'Name must be a string'
      })
    }
  }
  if (filters != null) {
    if (filters && typeof filters != 'object') {
      return res.status(400).json({
        error: 'Filters must be an array of strings'
      })
    }
    if (filters[0] && typeof filters[0] != 'string') {
      return res.status(400).json({
        error: 'Filters must be an array of strings'
      })
    }
  }

	if (name == null) {
    recipeList = await prisma.recipe.findMany({
      where: {
        tagId: { hasSome: filters}
      }
    })
	} else if(filters == null){
	recipeList = await prisma.recipe.findMany({
		where: {
		  name: { contains: name }
		}
	  })
	}
	else {
    recipeList = await prisma.recipe.findMany({
      where: {
        name: { contains: name },
        tagId: { hasSome: filters}
      }
    })
  }

  return res.status(200).json(recipeList)
})

// app.post('/recipe/create', async (req, res, next) => {
//   //   //Create recipe in database and return recipeId.

//   //   //incoming name, desc, image, macroTrack, authorId, instructions, ingredients, tagId
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

//   //   //If any missing, return error
//   if (
//     name == null ||
//     desc == null ||
//     image == null ||
//     macroTrack == null ||
//     authorId == null
//   ) {
//     return res.status(400).json({
//       error:
//         'Missing argument (requires name, desc, image, macroTrack & authorId)'
//     })
//   }

//   if (
//     (name && typeof name !== 'string') ||
//     (desc && typeof desc !== 'string') ||
//     (image && typeof image !== 'string') || //arrays return object
//     (macroTrack && typeof macroTrack != 'object') ||
//     (authorId && typeof authorId !== 'string') ||
//     (macroTrack[0] && typeof macroTrack[0] != 'number') //instructions/ingredients/tagId not necessary
//   ) {
//     return res.status(400).json({
//       error:
//         'Name, desc and authorId must be strings.\n MacroTrack must be an array of floats.'
//     })
//   }
//   if (
//     (tagId && typeof tagId != 'object') ||
//     (ingredients[0] && typeof ingredients[0] != 'string') ||
//     (tagId[0] && typeof tagId[0] != 'string')
//   ) {
//   }
//   if (instructions != null) {
//     if (
//       (instructions && typeof instructions != 'object') ||
//       (instructions[0] && typeof instructions[0] != 'string')
//     ) {
//       return res.status(400).json({
//         error: 'Instructions must be an array of strings'
//       })
//     }
//   }
//   if (ingredients != null) {
//     if (
//       (ingredients && typeof ingredients != 'object') ||
//       (ingredients[0] && typeof ingredients[0] != 'string')
//     ) {
//       return res.status(400).json({
//         error: 'Ingredients must be an array of strings'
//       })
//     }
//   }
//   if (tagId != null) {
//     if (
//       (tagId && typeof tagId != 'object') ||
//       (tagId[0] && typeof tagId[0] != 'string')
//     ) {
//       return res.status(400).json({
//         error: 'tagId must be an array of strings'
//       })
//     }
//   }

//   if (macroTrack.length != 4) {
//     return res.status(400).json({
//       error: 'Marco Array missing parameter [Must Be 4 Floats]'
//     })
//   }
//   let recipe = await prisma.recipe.create({
//     data: {
//       name: name,
//       desc: desc,
//       image: image,
//       macroTrack: macroTrack,
//       authorId: authorId,
//       ...(instructions ? { instructions } : {}),
//       ...(ingredients ? { ingredients } : {}),
//       ...(tagId ? { tagId } : {})
//     }
//   })

//   let ret = { recipeId: recipe.id, error: '' }
//   return res.status(200).json(ret)
// })

export default app
