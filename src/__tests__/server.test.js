import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import app from '../server'

dotenv.config({ paths: '../../.env'});

const prisma = new PrismaClient()

// test('create account for database', async () => {
//     await prisma.account.deleteMany({
//         where: { email: "testme@test.com" }
//     })

//     await prisma.account.create({
//         data: {
//             email: "testme@test.com",
//             name: 'Billy Bob Joe',
//             username: 'The Creature',
//             password: 'BIG EATER',
//             desc: 'I CONSUME the EARTH and all of its inhabitants',
//         },
//     })
//     const user = await prisma.account.findFirst({
//         where: { email: 'testme@test.com' }
//     })
//     expect(user.name).toBe("Billy Bob Joe")
// }, 15000)

describe('User API Endpoints', () => {
    beforeAll(async() => {
        try {
            await prisma.account.deleteMany({
                where: {
                    username: { startsWith: '_test' }
                }
            })
        } catch (error) {
            console.error('Error deleting test users:', error)
        }
    })

    let test1Id, test2Id

    it('POST /user/signup - should create a new user with a password and return an ID', async () => {
        let newUser, response, expected;

        newUser = {
            username: '_test1', email: 'test1@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)  
        expected = await prisma.account.findFirst({
            where: { username: newUser.username },
            select: { id: true }
        })

        expect(response.status).toBe(201)
        expect(response.body.userId).toEqual(expected.id)
        test1Id = expected.id

        newUser = {
            username: '_test2', email: 'test2@test.com',
            displayName: 'test', googleId: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expected = await prisma.account.findFirst({
            where: { username: newUser.username },
            select: { id: true }
        })

        expect(response.status).toBe(201)
        expect(response.body.userId).toEqual(expected.id)
        test2Id = expected.id
    })

    it('POST /user/signup - should fail and return a 409 because of existing username or email', async () => {
        let newUser, response;

        newUser = {
            username: '_test1', email: 'test12@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(409)

        newUser = {
            username: '_test12', email: 'test1@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(409)
    })
    
    it('POST /user/signup - should fail and return a 400 because of missing arguments', async () => {
        let newUser, response;

        newUser = {
            username: '_test12', email: 'test12@test.com',
            displayName: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test12', email: 'test12@test.com',
            password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test12',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            email: 'test12@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)
    })

    it('POST /user/signup - should fail and return a 400 because of invalid arguments', async () => {
        let newUser, response;

        newUser = {
            username: 1, email: 'test1@test.com',
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 1,
            displayName: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            displayName: 1, password: 'test'
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            displayName: 'test', password: 1
        }
        response = await request(app)
            .post('/user/signup')
            .send(newUser)
        expect(response.status).toBe(400)
    })

    it('POST /user/login - should return the correct ID', async () => {
        let user, response, expected;

        user = { username: "_test1", password: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expected = await prisma.account.findFirst({
            where: { username: user. username },
            select: { id: true }
        })
        expect(response.status).toBe(200)
        expect(response.body.userId).toEqual(expected.id)

        user = { email: "test1@test.com", password: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expected = await prisma.account.findFirst({
            where: { email: user.email },
            select: { id: true }
        })
        expect(response.status).toBe(200)
        expect(response.body.userId).toEqual(expected.id)

        user = { email: "test2@test.com", googleId: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expected = await prisma.account.findFirst({
            where: { email: user.email },
            select: { id: true }
        })
        expect(response.status).toBe(200)
        expect(response.body.userId).toEqual(expected.id)
    })
    
    it('POST /user/login - should fail and return a 401 because of incorrect username or password', async () => {
        let user, response;

        user = { username: "_test1", password: "test1" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expect(response.status).toBe(401)

        user = { username: "_test12", password: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expect(response.status).toBe(401)
    })
    
    it('POST /user/login - should fail and return a 400 because of missing arguments', async () => {
        let user, response;

        user = { username: "_test1" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expect(response.status).toBe(400)

        user = { password: "test" }
        response = await request(app)
            .post('/user/login')
            .send(user)
        expect(response.status).toBe(400)
    })

    it('POST /user/login - should fail and return a 400 because of invalid arguments', async () => {
        let newUser, response;

        newUser = {
            username: 1, email: 'test1@test.com',
            googleId: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/login')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 1,
            googleId: 'test', password: 'test'
        }
        response = await request(app)
            .post('/user/login')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            googleId: 1, password: 'test'
        }
        response = await request(app)
            .post('/user/login')
            .send(newUser)
        expect(response.status).toBe(400)

        newUser = {
            username: '_test1', email: 'test1@test.com',
            googleId: 'test', password: 1
        }
        response = await request(app)
            .post('/user/login')
            .send(newUser)
        expect(response.status).toBe(400)
    })
})