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
            await prisma.recipe.create({
                data : {
                    name: "_test",
                    desc: "testing desc",
                    image: "",
                    calories: 100,
                    fat: 200,
                    carbs: 300,
                    protein: 1000,
                    authorId: "6724e84caf5041d082f98234",
                    instructions: ["testInstructions"],
                    ingredients: ["testing"],
                    tagId: ["6724e84caf5041d082f98234"]
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
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 1200,
            firstidx: 0,
            lastidx: 10
        }
        response = await request(recipeList)
        console.log(response)
        expect(response.status).toBe(200)

        recipeList = {
            name: "_test", 
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"],
            firstidx: 0,
            lastidx: 10
        }
        response = await request(recipeList)
        console.log(response)
        expect(response.status).toBe(200)



    })

    it('should fail/return 400 due to invalid input', async() => {
        let recipeList, response;

        recipeList = {
            name: 1, 
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)

        recipeList = {
            name: "_test", 
            minCalories: "hi",
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)

        recipeList = {
            name: "_test", 
            minCalories: 0,
            maxCalories: "hi",
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)

        recipeList = {
            name: "_test", 
            minCalories: 0,
            maxCalories: 200,
            minFat: "hi",
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)

        recipeList = {
            name: "_test", 
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: "hi",
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)

        recipeList = {
            name: "_test", 
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: "hi",
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)

        recipeList = {
            name: "_test", 
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: "hi",
            minProtein: 100,
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)

        recipeList = {
            name: "_test", 
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: "hi",
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)

        recipeList = {
            name: "_test", 
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: "hi",
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)

        recipeList = {
            name: "_test", 
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 100,
            tagId: 1
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)
    })

    it('should fail/return 400 due to missing inputs', async() => {
        let recipeList, response;

        recipeList = {
            minCalories: 0,
            maxCalories: 200,
            minFat: 0,
            maxFat: 300,
            minCarbs: 200,
            maxCarbs: 500,
            minProtein: 100,
            maxProtein: 1200,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(recipeList)
        expect(response.status).toBe(400)
 
    })
})