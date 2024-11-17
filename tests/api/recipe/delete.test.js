import handler from '../../../api/recipe/delete';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/recipe/delete', () => {
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

    let testRecipeId;

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

            let testUser = await prisma.account.create({
                data: {
                    username: '_test1', email: 'test1@test.com',
                    name: 'test', password: 'test', verified: true, verifyCode: "test"
                }
            })

            testRecipeId = await prisma.recipe.create({
                data: {
                    name: "_test1",
                    desc: "testing desc",
                    image: "",
                    calories: 200,
                    fat: 200,
                    carbs: 200,
                    protein: 20,
                    authorId: testUser.id,
                    instructions: [""],
                    ingredients: [""],
                }
            })

            testRecipeId = testRecipeId.id;

        } catch (error) {
            console.error(`Error Deleting Test Entries: ${error}`)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should delete an existing recipe with a given ID', async () => {
        let response = await request({id: testRecipeId})

        let expected = await prisma.recipe.findFirst({
            where: {id: testRecipeId}
        })

        expect(response.status).toBe(200)
        expect(expected).toEqual(null)
    })

    it('should fail and return a 400 error because id is missing', async () => {
        let response = await request({})

        expect(response.status).toBe(400)
    })

    it('should fail/return 409 due to recipe not existing', async() => {
        let response = await request({id: testRecipeId})
        
        expect(response.status).toBe(409)
    })
})
