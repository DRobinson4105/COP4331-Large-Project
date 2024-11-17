import handler from '../../../api/user/verifyemail';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/user/verifyemail', () => {
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

    beforeAll(async() => {
        await prisma.$connect();
        
        try {
            await prisma.account.deleteMany({
                where: {
                    username: { startsWith: '_test' }
                }
            })
            await prisma.account.create({
                data: {
                    username: '_test1', email: 'test1@test.com',
                    name: 'test', password: 'test', verified: true,
                    verifyCode: 'test'
                }
            })
        } catch (error) {
            console.error(`Error Deleting Test Entries: ${error}`)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should return true', async () => {
        let response = await request({ email: "test1@test.com" })
        expect(response.status).toBe(200)
        expect(response.body.taken).toBe(true)
    })

    it('should return false', async () => {
        let response = await request({ email: "test2@test.com" })
        expect(response.status).toBe(200)
        expect(response.body.taken).toBe(false)
    })

    it('should fail because of missing or invalid arguments', async () => {
        let response;
        
        response = await request({})
        expect(response.status).toBe(400)
        
        response = await request({ email: 1})
        expect(response.status).toBe(400)
    })
})