import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

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
        const { access_token } = req.body

        if (access_token == null) {
            return res.status(400).json({
                error: "Missing access_token argument"
            })
        }

        if (typeof access_token !== 'string') {
            return res.status(400).json({
                error: 'access_token must be a string'
            })
        }

        let result = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json'
            }
        })

        
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ email: result.data.email, id: result.data.id, name: result.data.name })
    } catch (error) {
        console.error('Error during signup:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}