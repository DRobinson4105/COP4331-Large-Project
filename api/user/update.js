import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const { username, name, image, desc, id, password, email } = req.body;

        if (id == null) {
            return res.status(400).json({
            error:
                'Missing argument (requires id)'
            })
        }

        if (
            ((username && typeof username !== 'string') && username != null) ||
            ((name && typeof name !== 'string') && name != null) ||
            ((id && typeof id !== 'string')) ||
            ((desc && typeof desc !== 'string') && desc != null) ||
            ((image && typeof image !== 'string') && image != null) ||
            ((email && typeof email !== 'string') && email != null) ||
            ((password && typeof password !== 'string') && password != null)
        ) {
            return res.status(400).json({
            error: 'Each argument must be a string or empty'
            })

        }

        let checker = await prisma.account.findFirst({
            where: {id: id}
        })

        if(checker == null){
            return res.status(409).json({ error: 'Account not found' })
        }
        let bufferImage
        if (image) {
			if (typeof image !== 'string') {
				return res.status(400).json({
					error: 'image must be a string'
				})
			}
			try {
				bufferImage = Buffer.from(image, 'base64')
			} catch (error){
				return res.status(400).json({
					error: 'Error occurred with image processing. Not valid image.'
				})
			}
		}

        if(checker.googleId != null && password != null){
            return res.status(409).json({ error: 'Cannot input a password to an object with a googleId'})
        }
        
        let updated = await prisma.account.update({
            where: {
                id: id
            },
            data: {
                ...(username ? { username } : {}),
                ...(name ? { name } : {}),
                ...(image ? { image: bufferImage } : {}),
                ...(desc ? { desc } : {}),
                ...(email ? { email } : {}),
                ...(password ? { password } : {})
            }
        })

        if(updated == null){
            return res.status(409).json({ error: 'Account not found' })
        }
    
        let ret = {  error: '' }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(ret)
    } catch (error) {
        console.error('Error during signup:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}