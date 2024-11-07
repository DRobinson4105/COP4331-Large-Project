import handler from '../../../api/recipe/update';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/recipe/update', () => {
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

    let testRecipeId, testRecipe;

    beforeAll(async() => {
        await prisma.$connect();
        
        try {
            await prisma.account.deleteMany({
                where: {
                    name: { startsWith: '_test' }
                }
            })

            testRecipe = await prisma.recipe.create({
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
            testRecipeId = testRecipe.id

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
            id: testRecipeId, name: '_test2',
            desc: 'test2', image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(200)

    })

    it('check to see if input is actually changed', async () => {
        let input, response, expected, final;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        input = {
            id: testRecipeId, name: '_test3',
            desc: 'test3', image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }

        // console.log("TestRecipeId ",testRecipeId)

        response = await request(input)
        final = await prisma.recipe.findFirst({
            where: {id: testRecipeId}
        })
        // console.log(final);

        expected = { id: final.id, email: final.email, 
        name: final.name, username: final.username, 
        image: final.image, desc: final.desc, password: final.password};
        var unBufferedimage = Buffer.toString(expected.image)
        expected.image = unBufferedimage

        expect(response.status).toBe(200)
        expect(input).toEqual(expected)
    })

    it('should fail and return a 400 error because id is missing', async () => {
        let input, response;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        input = {
            name: '_test3',
            desc: 'test3', image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)
    })

    it('should fail and return a 400 error due to invalid input', async () => {
        let input, response;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        input = {
            id: 1, name: '_test3',
            desc: 'test3', image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: 1,
            desc: 'test3', image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: '_test3',
            desc: 1, image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: '_test3',
            desc: 'test3', image: 1,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: '_test3',
            desc: 'test3', image: unencoded,
            calories: "Hi", fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: '_test3',
            desc: 'test3', image: unencoded,
            calories: 0, fat: "Hi", carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: '_test3',
            desc: 'test3', image: unencoded,
            calories: 0, fat: 0, carbs: "Hi", protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: '_test3',
            desc: 'test3', image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: "Hi",
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: '_test3',
            desc: 'test3', image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: 1, ingredients: ["Yo"],
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: '_test3',
            desc: 'test3', image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: 1,
            tagId: ["6724e84caf5041d082f98234"]
        }
        response = await request(input)
        expect(response.status).toBe(400)

        input = {
            id: testRecipeId, name: '_test3',
            desc: 'test3', image: unencoded,
            calories: 0, fat: 0, carbs: 0, protein: 0,
            instructions: ["Yo"], ingredients: ["Yo"],
            tagId: 1
        }
        response = await request(input)
        expect(response.status).toBe(400)
    })

    it('should update an existing user with an ID but only changes 1 thing', async () => {
        let input, response, expected;

        const testImage = './_testPhoto.jpg'
        const unencoded = btoa(testImage);

        input = {
            id: testRecipeId, name: '_test3',
        }
        response = await request(input)

        expect(response.status).toBe(200)
    })

    it('should fail/return 409 due to account not existing', async() =>{
        let account, response, expected;

        testRecipe = await prisma.recipe.create({
            data: {
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
        testRecipeId = testRecipe.id
    
        await prisma.recipe.delete({
            where: {id: testRecipeId}
        })

        let input = {
            id: testRecipeId, name: '_test3',
        }

        response = await request(input)
        expect(response.status).toBe(409)
    })

})
