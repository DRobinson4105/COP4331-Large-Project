import handler from '../../../api/recipe/get';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/recipe/get', () => {
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

    let test1Id, test2Id, testRecipeId, testRecipe;

    beforeAll(async() => {
        await prisma.$connect();
        
        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);
        
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
            testRecipe = await prisma.recipe.create({
                data: {
                    name: "_test2",
                    desc: "testing desc2",
                    calories: 100,
                    fat: 200,
                    carbs: 300,
                    protein: 10,
                    authorId: test2Id,
                    instructions:["_test Instructions"],
                    ingredients:["_testing"],
                    tagId:["6724e84caf5041d082f98234"]//Make tags before recipes to attach
                }
            })
            testRecipeId = testRecipe.id


        } catch (error) {
            console.error('Error Deleting Test Entries:', error)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should take in an id and return the recipe', async() =>{
        let recipe, response, expected;

        recipe = { id: testRecipeId}
        response = await request(recipe)
        expected = await prisma.recipe.findFirst({
            where: {id : testRecipeId}
        })
        expect(response.status).toBe(200)
        expect(response.body.name).toEqual(expected.name)//Changed to use name as it does not return an id

    })

    it('should fail/return 400 due to invalid argument', async() =>{
        let recipe, response, expected;

        recipe = { id: 1}
        response = await request(recipe)
        expected = await prisma.recipe.findFirst({
            where: {id : testRecipeId}
        })
        expect(response.status).toBe(400)

    })

    it('should fail/return 400 due to missing argument', async() =>{
        let recipe, response, expected;

        recipe = {}
        response = await request(recipe)
        expected = await prisma.recipe.findFirst({
            where: {id : testRecipeId}
        })
        expect(response.status).toBe(400)

    })

    it('should fail/return 409 due to missing argument', async() =>{
        let recipe, response, expected;

        recipe = {id: test1Id}
        response = await request(recipe)
        expected = await prisma.recipe.findFirst({
            where: {id : testRecipeId}
        })
        expect(response.status).toBe(409)
    })
})