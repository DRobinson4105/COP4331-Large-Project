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

    it('check to see if input is actually changed', async () => {
        let input, response, expected;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        input = {
            id: testAccountId, username: '_test3',
            desc: 'test3', password: 'test3',
            name: '_testnew3', image: unencoded
        }
        response = await request(input)

        expected = await prisma.account.findFirst({
            where: {id: testAccountId}
        })

        expect(response.status).toBe(200)
        expect(expected.username).toEqual("_test3")
    })

    it('should fail and return a 400 error because id is missing', async () => {
        let input, response;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        input = {
            username: '_test3',
            desc: 'test3', password: 'test3',
            name: '_testnew3', image: unencoded
        }
        response = await request(input)
        expect(response.status).toBe(400)
    })

    it('should fail and return a 400 error because username is a number', async () => {
        let input, response;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        input = {
            id: testAccountId, username: 42,
            desc: 'test3', password: 'test3',
            name: '_testnew3', image: unencoded
        }
        response = await request(input)
        expect(response.status).toBe(400)
    })

    it('should update an existing user with an ID but only changes 1 thing', async () => {
        let input, response, expected;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        input = {
            id: testAccountId, username: '_test3',
        }
        response = await request(input)

        expect(response.status).toBe(200)
    })

    it('should fail/return 409 due to account not existing', async() =>{
        let account, response, expected;

        testAccountId = await prisma.account.create({
            data: {
                name: "_test1",
                desc: "testing desc",
                email: "_test1@test.com",
                username: "_testuser",
                password: "password",
            }
        })
        account = testAccountId.id
    
        await prisma.account.delete({
            where: {id: account}
        })

        let input = {
            id: account, username: '_test3',
        }

        response = await request(input)
        
        expect(response.status).toBe(409)
    })

    it('should fail/return 409 due to inputting a password when there is a googleId', async() =>{
        let account, response, expected;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        let testAccountId2 = await prisma.account.create({
            data: {
                name: "_test1",
                desc: "testing desc",
                image: unencoded,
                email: "_test1@test.com",
                username: "testuser",
                googleId: "defagoogleid",
            }
        })
        testAccountId2 = testAccountId2.id

        account = {
            id: testAccountId2, password: 'password'
        }
        response = await request(account)
        
        expect(response.status).toBe(409)
    })
})
