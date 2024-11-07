import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler (req, res) {
	try {
		const{name, color} = req.body;
		
		if(
			(name == null ) ||
			(color == null)
		){
			return res.status(400).json({
				error: 'Missing argument (requires name & color)'
			})
		}

		if(
			(name && typeof name !== 'string')||
			(color && typeof color !== 'string')
			
		){
		return res.status(400).json({
			error: 'Each argument must be a string'
		})
		}

		let newTag = await prisma.tag.create({
			data:{
				name: name,
				color: color
			}
		})
		
		let ret = {id: newTag.id, error:''}
		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json(ret);
	} catch (error) {
		console.error('Error during creating tag:', error)
		res.setHeader('Content-Type', 'application/json')
		return res.status(500).json({ error: error })
	} finally {
		await prisma.$disconnect();
	}
}
