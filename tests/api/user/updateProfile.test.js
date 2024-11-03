import handler from '../../../api/user/updateProfile';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/user/updateProfile', () => {
    const request = async (body) => {
        const req = {
            method: 'PUT',
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

    let testAccountId;

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
                }
            })
            testAccountId = testAccountId.id

        } catch (error) {
            console.error(`Error Deleting Test Entries: ${error}`)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should update an existing user with an ID and info', async () => {
        let input, response, expected;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        input = {
            id: testAccountId, username: '_test2',
            desc: 'test2', password: 'test2',
            name: '_testnew', image: unencoded
        }
        response = await request(input)

        expect(response.status).toBe(200)
    })
/*
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
    })*/
})
