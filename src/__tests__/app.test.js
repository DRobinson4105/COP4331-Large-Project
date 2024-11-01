import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import app from '../app'

dotenv.config({ paths: '../../.env'});

const prisma = new PrismaClient()

describe('User API Endpoints', () => {
    beforeAll(async() => {
        try {
            await prisma.account.deleteMany({
                where: {
                    username: { startsWith: '_test' }
                }
            })
            await prisma.recipe.deleteMany({
				where: {
					name: { startsWith: '_test' }
				}
			})
        } catch (error) {
            console.error('Error Deleting Test Entries:', error)
        }
    })

    let test1Id, test2Id

    it('POST /user/signup - should create a new user with a password and return an ID', async () => {
        let newUser, response, expected;

        newUser = {
            username: '_test1', email: 'test1@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)  
        expected = await prisma.account.findFirst({
            where: { username: newUser.username },
            select: { id: true }
        })

        expect(response.status).toBe(201)
        expect(response.body.userId).toEqual(expected.id)
        test1Id = expected.id

        newUser = {
            username: '_test2', email: 'test2@test.com',
            displayName: 'test', googleId: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expected = await prisma.account.findFirst({
            where: { username: newUser.username },
            select: { id: true }
        })

        expect(response.status).toBe(201)
        expect(response.body.userId).toEqual(expected.id)
        test2Id = expected.id
    })

    it('POST /user/signup - should fail and return a 409 because of existing username or email', async () => {
        let newUser, response;

        newUser = {
            username: '_test1', email: 'test12@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(409)

        newUser = {
            username: '_test12', email: 'test1@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(409)
    })
    
    it('POST /user/signup - should fail and return a 400 because of missing arguments', async () => {
        let newUser, response;

        newUser = {
            username: '_test12', email: 'test12@test.com',
            displayName: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test12', email: 'test12@test.com',
            password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test12',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            email: 'test12@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)
    })

    it('POST /user/signup - should fail and return a 400 because of invalid arguments', async () => {
        let newUser, response;

        newUser = {
            username: 1, email: 'test1@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 1,
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            displayName: 1, password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            displayName: 'test', password: 1
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)
    })

    it('POST /user/login - should return the correct ID', async () => {
        let user, response, expected;

        user = { username: "_test1", password: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expected = await prisma.account.findFirst({
            where: { username: user. username },
            select: { id: true }
        })
        expect(response.status).toBe(200)
        expect(response.body.userId).toEqual(expected.id)

        user = { email: "test1@test.com", password: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expected = await prisma.account.findFirst({
            where: { email: user.email },
            select: { id: true }
        })
        expect(response.status).toBe(200)
        expect(response.body.userId).toEqual(expected.id)

        user = { email: "test2@test.com", googleId: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expected = await prisma.account.findFirst({
            where: { email: user.email },
            select: { id: true }
        })
        expect(response.status).toBe(200)
        expect(response.body.userId).toEqual(expected.id)
    })
    
    it('POST /user/login - should fail and return a 401 because of incorrect username or password', async () => {
        let user, response;

        user = { username: "_test1", password: "test1" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expect(response.status).toBe(401)

        user = { username: "_test12", password: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expect(response.status).toBe(401)
    })
    
    it('POST /user/login - should fail and return a 400 because of missing arguments', async () => {
        let user, response;

        user = { username: "_test1" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expect(response.status).toBe(400)

        user = { password: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expect(response.status).toBe(400)
    })

    it('POST /user/login - should fail and return a 400 because of invalid arguments', async () => {
        let newUser, response;

        newUser = {
            username: 1, email: 'test1@test.com',
            googleId: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/login')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 1,
            googleId: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/login')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            googleId: 1, password: 'test'
        }
        response = await request(app)
            .post('/user/login')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            googleId: 'test', password: 1
        }
        response = await request(app)
            .post('/user/login')
            .send(newUser)
        expect(response.status).toBe(400)
    })




	it('POST /recipe/create - should create a new recipe with parameters and return recipeId', async() =>{
		let newRecipe, response, expected;

        let user = { username: "_test1", password: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        

		const testImage = `${__dirname}/_testPhoto.jpg`
        const unencoded = btoa(testImage);
		newRecipe = {
			name: "_test",
			desc: "testing desc",
			image: unencoded,
			macroTrack: [1.0, 2.0, 3.0, 4.0],//Needs Four 
			authorId: test1Id,
			instructions: ["test Instructions"],
			ingredients: ["test ing"],
			tagId: ["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		
		response = await request(app)
            .post('/recipe/create')
            .send(newRecipe)
        expected = await prisma.recipe.findFirst({
            where: { name: newRecipe.name },
            select: { id: true }
        })

		expect(response.status).toBe(200)
		expect(response.body.recipeId).toEqual(expected.id)
		


		newRecipe = {
			name: "_test2",
			desc: "testing desc2",
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}

		response = await request(app).post('/recipe/create').send(newRecipe)  
        expected = await prisma.recipe.findFirst({
            where: { name: newRecipe.name },
            select: { id: true }
        })
        expect(response.status).toBe(200)
		expect(response.body.recipeId).toEqual(expected.id)
	

	})

// 	it('POST /user/createRecipe - should fail and return a 400 due to invalid arguments', async() =>{
// 		let newRecipe, response;

// 		newRecipe = {
// 			name: 1,
// 			desc: "testing desc2",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:[0.0],
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 		newRecipe = {
// 			name: "_test",
// 			desc: 1,
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:[0.0],
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 		newRecipe = {
// 			name: "_test",
// 			desc: "testing desc2",
// 			image: 1,
// 			macroTrack:[0.0],
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)


// 		newRecipe = {
// 			name: "_test",
// 			desc: "testing desc2",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:1,
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 		newRecipe = {
// 			name: "_test",
// 			desc: "testing desc2",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:[0.0],
// 			authorId:1,
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 		newRecipe = {
// 			name: "_test",
// 			desc: "testing desc2",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:[0.0],
// 			authorId:"_test authorId2",
// 			instructions:1,
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 		newRecipe = {
// 			name: "_test",
// 			desc: "testing desc2",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:[0.0],
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:1,
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 		newRecipe = {
// 			name: "_test",
// 			desc: "testing desc2",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:[0.0],
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:1
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 	})

// 	it('POST /user/createRecipe - should fail and return a 400 due to missing arguments', async() =>{
// 		let newRecipe, response;

// 		newRecipe = {
// 			desc: "testing desc2",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:[0.0],
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 		newRecipe = {
// 			name: "_test",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:[0.0],
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 		newRecipe = {
// 			name: "_test",
// 			desc: "testing desc2",
// 			macroTrack:[0.0],
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)


// 		newRecipe = {
// 			name: "_test",
// 			desc: "testing desc2",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			authorId:"_test authorId2",
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)

// 		newRecipe = {
// 			name: "_test",
// 			desc: "testing desc2",
// 			image: document.getElementById("_testPhoto.jpeg"),
// 			macroTrack:[0.0],
// 			instructions:"_test Instructions",
// 			ingredients:"_test ing",
// 			tagId:"_testId2"
// 		}
// 		response = await request(app).post('/user/createRecipe').send(newRecipe)
//         expect(response.status).toBe(400)


// 	})

})