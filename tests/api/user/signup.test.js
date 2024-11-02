import handler from '../../../api/user/signup';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/user/signup', () => {
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
        } catch (error) {
            console.error(`Error Deleting Test Entries: ${error}`)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new user with a password and return an ID', async () => {
        let newUser, response, expected;

        newUser = {
            username: '_test1', email: 'test1@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(newUser)
        expected = await prisma.account.findFirst({
            where: { username: newUser.username },
            select: { id: true }
        })

        expect(response.status).toBe(201)
        expect(response.body.userId).toEqual(expected.id)

        newUser = {
            username: '_test2', email: 'test2@test.com',
            displayName: 'test', googleId: 'test'
        }
        response = await request(newUser)
        expected = await prisma.account.findFirst({
            where: { username: newUser.username },
            select: { id: true }
        })

        expect(response.status).toBe(201)
        expect(response.body.userId).toEqual(expected.id)
    })

    it('should fail and return a 409 because of existing username or email', async () => {
        let newUser, response;

        newUser = {
            username: '_test1', email: 'test12@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(409)

        newUser = {
            username: '_test12', email: 'test1@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(409)
    })
    
    it('should fail and return a 400 because of missing arguments', async () => {
        let newUser, response;

        newUser = {
            username: '_test12', email: 'test12@test.com',
            displayName: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test12', email: 'test12@test.com',
            password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test12',
            displayName: 'test', password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)

        newUser = {
            email: 'test12@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)
    })

    it('should fail and return a 400 because of invalid arguments', async () => {
        let newUser, response;

        newUser = {
            username: 1, email: 'test1@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 1,
            displayName: 'test', password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            displayName: 1, password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            displayName: 'test', password: 1
        }
        response = await request(newUser)
        expect(response.status).toBe(400)
    })
})