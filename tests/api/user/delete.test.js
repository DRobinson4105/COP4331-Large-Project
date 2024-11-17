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

    let testUserId;

    beforeAll(async() => {
        await prisma.$connect();
        
        try {
            await prisma.account.deleteMany({
                where: {
                    username: { startsWith: '_test' }
                }
            })

            testUserId = await prisma.account.create({
                data: {
                    name: "_test1",
                    desc: "testing desc",
                    email: "_test1@test.com",
                    username: "_testuser",
                    password: "password",
                    verified: true,
                    verifyCode: 'test'
                }
            })
            testUserId = testUserId.id

        } catch (error) {
            console.error(`Error Deleting Test Entries: ${error}`)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should delete an existing user with a given ID', async () => {
        let response = await request({id: testUserId})

        let expected = await prisma.account.findFirst({
            where: {id: testUserId}
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
        let account = {id: testUserId}
        let response = await request(account)
        
        expect(response.status).toBe(409)
    })
})
