import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler (req, res) {
	try {
		const { name } = req.body

		if ( name == null) 
		{
		return res.status(400).json({
			error: 'Missing argument (requires name)'
		})
		}

		if (name && typeof name != 'string')
		{
			return res.status(400).json({
			error: 'name must be a string'
			})
		
		}

		//Change to different macros and search using that
		let tagList = await prisma.tag.findMany({
			where: {
				name: { contains: name }
			},
		})

		res.setHeader('Content-Type', 'application/json')
		return res.status(200).json(tagList)
	} catch (error) {
		console.error('Error during searching tags:', error)
		res.setHeader('Content-Type', 'application/json')
		return res.status(500).json({ error: error.message })
	} finally {
		await prisma.$disconnect()
	}
}
