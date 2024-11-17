import handler from '../../../api/user/login';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/user/login', () => {
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
                    name: 'test', password: 'test', varified: true,
                    varifyCode: 'test'
                }
            })
            await prisma.account.create({
                data: {
                    username: '_test2', email: 'test2@test.com',
                    name: 'test', googleId: 'test', varified: true,
                    varifyCode: 'test'
                }
            })
        } catch (error) {
            console.error(`Error Deleting Test Entries: ${error}`)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should return the correct ID', async () => {
        let user, response, expected;

        user = { username: "_test1", password: "test" }
        response = await request(user)
        expected = await prisma.account.findFirst({
            where: { username: user. username },
            select: { id: true }
        })
        expect(response.status).toBe(200)
        expect(response.body.userId).toEqual(expected.id)

        user = { email: "test1@test.com", password: "test" }
        response = await request(user)
        expected = await prisma.account.findFirst({
            where: { email: user.email },
            select: { id: true }
        })
        expect(response.status).toBe(200)
        expect(response.body.userId).toEqual(expected.id)

        user = { email: "test2@test.com", googleId: "test" }
        response = await request(user)
        expected = await prisma.account.findFirst({
            where: { email: user.email },
            select: { id: true }
        })
        expect(response.status).toBe(200)
        expect(response.body.userId).toEqual(expected.id)
    })
    
    it('should fail and return a 401 because of incorrect username or password', async () => {
        let user, response;

        user = { username: "_test1", password: "test1" }
        response = await request(user)
        expect(response.status).toBe(401)

        user = { username: "_test12", password: "test" }
        response = await request(user)
        expect(response.status).toBe(401)
    })
    
    it('should fail and return a 400 because of missing arguments', async () => {
        let user, response;

        user = { username: "_test1" }
        response = await request(user)
        expect(response.status).toBe(400)

        user = { password: "test" }
        response = await request(user)
        expect(response.status).toBe(400)
    })

    it('should fail and return a 400 because of invalid arguments', async () => {
        let newUser, response;

        newUser = {
            username: 1, email: 'test1@test.com',
            googleId: 'test', password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 1,
            googleId: 'test', password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            googleId: 1, password: 'test'
        }
        response = await request(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            googleId: 'test', password: 1
        }
        response = await request(newUser)
        expect(response.status).toBe(400)
    })
})