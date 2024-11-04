import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, name, image, desc, id, password } = req.body;

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
        
        let updated = await prisma.account.update({
            where: {
                id: id
            },
            data: {
                ...(username ? { username } : {}),
                ...(name ? { name } : {}),
                ...(image ? { image } : {}),
                ...(desc ? { desc } : {}),
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