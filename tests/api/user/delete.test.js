import handler from '../../../api/user/delete';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/user/delete', () => {
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

    let testAccountId, savedId;

    beforeAll(async() => {
        await prisma.$connect();
        
        try {
            await prisma.account.deleteMany({
                where: {
                    username: { startsWith: '_test' }
                }
            })

            testAccountId = await prisma.account.create({
                data: {
                    name: "_test1",
                    desc: "testing desc",
                    email: "_test1@test.com",
                    username: "_testuser",
                    password: "password",
                    varified: true,
                    varifyCode: 'test'
                }
            })
            testAccountId = testAccountId.id
            savedId = testAccountId

        } catch (error) {
            console.error(`Error Deleting Test Entries: ${error}`)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should delete an existing user with a given ID', async () => {
        let input, response, expected;

        input = {id: testAccountId}
        response = await request(input)

        expect(response.status).toBe(200)
    })

    it('check to see if input is actually deleted', async () => {
        let input, response, expected;

        testAccountId = await prisma.account.create({
            data: {
                name: "_test1",
                desc: "testing desc",
                email: "_test1@test.com",
                username: "_testuser",
                password: "password",
                varified: true,
                varifyCode: 'test'
            }
        })
        testAccountId = testAccountId.id

        input = { id: testAccountId }
        response = await request(input)

        expected = await prisma.account.findFirst({
            where: {id: testAccountId}
        })

        expect(response.status).toBe(200)
        expect(expected).toEqual(null)
    })

    it('should fail and return a 400 error because id is missing', async () => {
        let input, response;

        input = {}
        response = await request(input)
        expect(response.status).toBe(400)
    })

    it('should fail/return 409 due to account not existing', async() =>{
        let account, response, expected;
    
        account = {id: savedId}
        response = await request(account)
        
        expect(response.status).toBe(409)
    })
})
