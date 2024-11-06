import handler from '../../../api/recipe/delete';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/recipe/delete', () => {
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

    let testRecipe, savedId;

    beforeAll(async() => {
        await prisma.$connect();
        
        try {
            await prisma.recipe.deleteMany({
                where: {
                    name: { startsWith: '_test' }
                }
            })

            testRecipe = await prisma.recipe.create({
                data: {
                    name: "_test1",
                    desc: "testing desc",
                    image: "",
                    calories: 200,
                    fat: 200,
                    carbs: 200,
                    protein: 20,
                    authorId: "6723f006ba10f4fd6307a8e9",
                    instructions: [""],
                    ingredients: [""],
                    tagId: ["6723f006ba10f4fd6307a8e9"]
                }
            })
            savedId = testRecipe.id;
            

        } catch (error) {
            console.error(`Error Deleting Test Entries: ${error}`)
        }
    })

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should delete an existing recipe with a given ID', async () => {
        let input, response, expected;
        let id = testRecipe.id;
        input = {id: id}
        response = await request(input)

        expect(response.status).toBe(200)
    })

    it('check to see if input is actually deleted', async () => {
        let input, response, expected;

        testRecipe = await prisma.recipe.create({
            data: {
                name: "_test1",
                desc: "testing desc",
                image: "",
                calories: 200,
                fat: 200,
                carbs: 200,
                protein: 20,
                authorId: "6723f006ba10f4fd6307a8e9",
                instructions: ["Yo"],
                ingredients: ["Yo"],
                tagId: ["6723f006ba10f4fd6307a8e9"]
            }
        })
        
        let id = testRecipe.id;
        input = { id: id}
        response = await request(input)

        expected = await prisma.recipe.findFirst({
            where: {id: testRecipe.id}
        })

        expect(response.status).toBe(200)
        expect(expected).toEqual(null)
    })

    it('should fail and return a 400 error because id is missing', async () => {
        let input, response;

        input = {}
        response = await request(input)
        expect(response.status).toBe(400)
    })

    it('should fail/return 409 due to recipe not existing', async() =>{
        let recipe, response, expected;
    
        recipe = {id: savedId}
        response = await request(recipe)
        
        expect(response.status).toBe(409)
    })
})
