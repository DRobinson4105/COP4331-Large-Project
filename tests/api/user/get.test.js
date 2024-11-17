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

    let test1Id, test2Id, testAccountId, recipeTestId, testAccountId2;

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
            testAccountId = await prisma.account.create({
                data: {
                    name: "_test1",
                    desc: "testing desc",
                    email: "_test1@test.com",
                    username: "testuser",
                    password: "password",
                    varified: true,
                    varifyCode: 'true'
                }
            })
            testAccountId = testAccountId.id

            testAccountId2 = await prisma.account.create({
                data: {
                    name: "_test1",
                    desc: "testing desc",
                    email: "_test1@test.com",
                    username: "testuser",
                    password: "password",
                    varified: true,
                    varifyCode: 'test'
                }
            })
            testAccountId2 = testAccountId2.id
            
            test1Id = await prisma.recipe.create({
                data: {
                    name: "_test1",
                    desc: "testing desc",
                    calories: 1,
                    fat: 1,
                    carbs: 1,
                    protein: 1,
                    authorId: testAccountId2,
                    instructions: ["testInstructions"],
                    ingredients: ["testing"],
                    tagId: ["6724e84caf5041d082f98234"]//Make tags before recipes to attach
                }
            })
            test1Id = test1Id.id

            recipeTestId = await prisma.recipe.create({
                data: {
                    name: "_testrec",
                    desc: "recipe description",
                    calories: 1,
                    fat: 1,
                    carbs: 1,
                    protein: 1,
                    authorId: testAccountId
                }
            })
            recipeTestId = recipeTestId.id
            
        } catch (error) {
            console.error('Error Deleting Test Entries:', error)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should take in an id and return the account', async() =>{
        let account, response, expected;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        let recipe = [{
            id: recipeTestId,
            name: "_testrec",
            image: null,
            desc: "recipe description",
            tagId: []
        }]

        account = { id: testAccountId}
        response = await request(account)
        expected = { password: "password", isGoogle: false, email: '_test1@test.com', 
            name: '_test1', username: 'testuser', 
            desc: 'testing desc', recipes: recipe, error: ''};
        expect(response.status).toBe(200)
        expect(response.body).toEqual(expected)

    })

    it('should fail/return 400 due to invalid argument', async() =>{
        let account, response, expected;

        account = { id: 1}
        response = await request(account)
        expected = await prisma.account.findFirst({
            where: {id : testAccountId}
        })
        expect(response.status).toBe(400)

    })

    it('should fail/return 400 due to missing argument', async() =>{
        let account, response, expected;

        account = {}
        response = await request(account)
        expected = await prisma.account.findFirst({
            where: {id : testAccountId}
        })
        expect(response.status).toBe(400)

    })

    it('should fail/return 409 due to account not existing', async() =>{
        let account, response, expected;

        account = {id: test1Id}
        response = await request(account)
        expected = await prisma.account.findFirst({
            where: {id : testAccountId}
        })
        expect(response.status).toBe(409)
    })
})