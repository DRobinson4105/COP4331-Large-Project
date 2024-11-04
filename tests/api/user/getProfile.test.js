import handler from '../../../api/user/getProfile';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/user/getProfile', () => {
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

    let test1Id, test2Id, testAccountId;

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
                    image: unencoded,
                    email: "_test1@test.com",
                    username: "testuser",
                    password: "password",
                }
            })
            testAccountId = testAccountId.id

            test1Id = await prisma.recipe.create({
                data: {
                    name: "_test1",
                    desc: "testing desc",
                    image: unencoded,
                    macroTrack: [1.0, 2.0, 3.0, 4.0],//Needs Four 
                    authorId: testAccountId,
                    instructions: ["testInstructions"],
                    ingredients: ["testing"],
                    tagId: ["6724e84caf5041d082f98234"]//Make tags before recipes to attach
                }
            })
            test1Id = test1Id.id
            
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

        account = { id: testAccountId}
        response = await request(account)
        expected = { id: testAccountId, email: '_test1@test.com', 
            name: '_test1', username: 'testuser', 
            image: unencoded, desc: 'testing desc', error: ''};
        expect(response.status).toBe(200)
        expect(response.body.id).toEqual(expected.id)

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