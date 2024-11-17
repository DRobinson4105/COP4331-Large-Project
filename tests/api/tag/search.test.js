import handler from '../../../api/tag/search';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/tag/search', () => {
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

    let newTag = {
        name: "_test",
    }
    


    it('should take in name/tag and return an array of tags', async() =>{

        let tag, response;



        tag = {
            name: "_test", 
        }
        response = await request(tag)
        
        expect(response.status).toBe(200)


        tag = {
            name: "_test", 
        }
        response = await request(tag)
        
        expect(response.status).toBe(200)
    })

    it('should fail/return 400 due to invalid input', async() => {
        let tagList, response;

        tagList = {
            name: 1, 
        }
        response = await request(tagList)
        expect(response.status).toBe(400)

        
    })

    it('should fail/return 400 due to missing inputs', async() => {
        let tagList, response;

        tagList = {

        }
        
        response = await request(tagList)
        expect(response.status).toBe(400)
       
    })
})