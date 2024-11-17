import handler from '../../../api/user/get';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/user/get', () => {
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

    let testId, testRecipeId;

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
            
            testId = await prisma.account.create({
                data: {
                    username: '_test1', email: 'test1@test.com', desc: "testing desc",
                    name: 'test', password: 'test', verified: true, verifyCode: "test"
                }
            })
            testId = testId.id

            testRecipeId = await prisma.recipe.create({
                data: {
                    name: "_test1",
                    desc: "testing desc",
                    calories: 1,
                    fat: 1,
                    carbs: 1,
                    protein: 1,
                    authorId: testId,
                    instructions: ["testInstructions"],
                    ingredients: ["testing"],
                    tagId: []
                }
            })
            testRecipeId = testRecipeId.id
            
        } catch (error) {
            console.error('Error Deleting Test Entries:', error)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should take in an id and return the account', async() =>{
        let recipe = [{
            id: testRecipeId,
            name: "_test1",
            desc: "testing desc",
            tagId: [],
            image: null
        }]

        let response = await request({ id: testId })
        let expected = {
            password: "test", isGoogle: false, email: 'test1@test.com', name: 'test',
            username: '_test1', desc: 'testing desc', recipes: recipe, error: ''
        };

        expect(response.status).toBe(200)
        expect(response.body).toEqual(expected)

    })

    it('should fail/return 400 due to invalid or missing argument', async() =>{
        let response = await request({ id: 1 })

        expect(response.status).toBe(400)

        response = await request({})

        expect(response.status).toBe(400)
    })

    it('should fail/return 409 due to account not existing', async() =>{
        let account = { id: testRecipeId }
        let response = await request(account)

        expect(response.status).toBe(409)
    })
})