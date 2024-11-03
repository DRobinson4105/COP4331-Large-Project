import handler from '../../../api/recipe/search';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/recipe/search', () => {
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
            await prisma.recipe.deleteMany({
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

    it('should take in name/filters and return an array of recipes', async() =>{
        let recipeList, response;

        recipeList = {
            name: "_test", 
            filters: ["6724e84caf5041d082f98234"]//Make tags before recipes to attach
        }
        response = await request(recipeList)
        
        expect(response.status).toBe(200)
    })

    it('should fail/return 400 due to invalid input', async() => {
        let recipeList, response;

        recipeList = {
            name: 1, 
            filters: ["6724e84caf5041d082f98234"]//Make tags before recipes to attach
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)


        recipeList = {
            name: "G", 
            filters: 1//Make tags before recipes to attach
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)
        
    })

    it('should fail/return 400 due to missing inputs', async() => {
        let recipeList, response;

        recipeList = {
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)
       
    })
})