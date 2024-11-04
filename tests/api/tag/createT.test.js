import handler from '../../../api/tag/create';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/tag/create', () =>{
    
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
            await prisma.tag.deleteMany({
                where: {
                    name: { startsWith: '_test' }
                }
            })
        } catch (error) {
            console.error('Error Deleting Test Entries:', error)
        }

    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new tag with parameters and return tagID', async () => {

        let newTag, response, expected;

        newTag = {
            name : "_test1",
            color: "Yellow"
        }

        response = await request(newTag)
        expected = await prisma.tag.findFirst({
            where: {name: newTag.name},
            select: {id: true}
        })

        expect(response.status).toBe(200)
		expect(response.body.id).toEqual(expected.id)

        newTag = {
            name : "_test2",
            color: "Blue"
        }

        response = await request(newTag)
        expected = await prisma.tag.findFirst({
            where: {name: newTag.name},
            select: {id: true}
        })

        expect(response.status).toBe(200)
		expect(response.body.id).toEqual(expected.id)
    })

    it('should fail and return a 400 due to invalid arguments', async () => {
        let newTag, response;

        newTag = {
            name: 1,
            color: "Yellow"
        }

        response = await request(newTag)
        expect(response.status).toBe(400)

        newTag = {
            name: "_test",
            color: 1
        }

        response = await request(newTag)
        expect(response.status).toBe(400)
    })

    it('should fail and return a 400 due to missing arguments', async () => {
        let newTag, response;
        
        newTag = {
            name: "_test1"
        }

        response = await request(newTag)
        expect(response.status).toBe(400)

        newTag = {
            name: "_test2"
        }

        response = await request(newTag)
        expect(response.status).toBe(400)
    })
})