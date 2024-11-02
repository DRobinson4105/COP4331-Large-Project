import handler from '../../../api/recipe/create';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/recipe/create', () => {
    const request = async (body) => {
        const req = {
            method: 'POST',
            body: body
        };
    
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn()
        };
    
        await handler(req, res);

        return {status: res.status.mock.calls[0][0], body: res.json.mock.calls[0][0]};
    }

    let test1Id, test2Id;

    beforeAll(async() => {
        await prisma.$connect();
        
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
            test1Id = await prisma.account.create({
                data: {
                    username: '_test1', email: 'test1@test.com',
                    name: 'test', password: 'test'
                }
            })
            test1Id = test1Id.id
            test2Id = await prisma.account.create({
                data: {
                    username: '_test2', email: 'test2@test.com',
                    name: 'test', googleId: 'test'
                }
            })
            test2Id = test2Id.id
        } catch (error) {
            console.error('Error Deleting Test Entries:', error)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new recipe with parameters and return recipeId', async() => {
		let newRecipe, response, expected;
        
		const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);
		newRecipe = {
			name: "_test",
			desc: "testing desc",
			image: unencoded,
			macroTrack: [1.0, 2.0, 3.0, 4.0],
			authorId: test1Id,
			instructions: ["testInstructions"],
			ingredients: ["testing"],
			tagId: ["6724e84caf5041d082f98234"]
		}

		response = await request(newRecipe)
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

		response = await request(newRecipe)
        expected = await prisma.recipe.findFirst({
            where: { name: newRecipe.name },
            select: { id: true }
        })
        expect(response.status).toBe(200)
		expect(response.body.recipeId).toEqual(expected.id)
	})
    
	it('should fail and return a 400 due to invalid arguments', async() => {
		let newRecipe, response;
        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

		newRecipe = {
			name: 1,
			desc: "testing desc2",
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
			name: "_test",
			desc: 1,
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
			name: "_test",
			desc: "testing desc2",
			image: 1,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)


		newRecipe = {
			name: "_test",
			desc: "testing desc2",
			image: unencoded,
			macroTrack: 1,
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach"
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
			name: "_test",
			desc: "testing desc2",
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: 1,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
			name: "_test",
			desc: "testing desc2",
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:1,
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
			name: "_test",
			desc: "testing desc2",
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:1,
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
			name: "_test",
			desc: "testing desc2",
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:1
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

	})

	it('should fail and return a 400 due to missing arguments', async() => {
		let newRecipe, response;
        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

		newRecipe = {
			desc: "testing desc2",
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
            name: "_test2",
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
            name: "_test2",
			desc: "testing desc2",
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
            name: "_test2",
			desc: "testing desc2",
			image: unencoded,
			authorId: test2Id,
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)

		newRecipe = {
            name: "_test2",
			desc: "testing desc2",
			image: unencoded,
			macroTrack:[1.0, 2.0, 3.0, 4.0],
			instructions:["_test Instructions"],
			ingredients:["_testing"],
			tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
		}
		response = await request(newRecipe)
        expect(response.status).toBe(400)
	})
})