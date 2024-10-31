import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'
dotenv.config({ paths: '../../.env'});

const prisma = new PrismaClient()

test('create account for database', async () => {
    await prisma.account.deleteMany({
        where: { email: "testme@test.com" }
    })

    await prisma.account.create({
        data: {
            email: "testme@test.com",
            name: 'Billy Bob Joe',
            username: 'The "Creature"',
            password: 'BIG EATER',
            desc: 'I CONSUME the EARTH and all of its inhabitants',
        },
    })
    const user = await prisma.account.findFirst({
        where: { email: 'testme@test.com' }
    })
    expect(user.name).toBe("Billy Bob Joe")
}, 15000)