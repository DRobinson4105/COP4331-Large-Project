import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });

export default async function handler(req, res) {
    try {
        const { username, displayName, password, googleId, email } = req.body;
        res.setHeader('Content-Type', 'application/json');

        if (
            (username && typeof username !== 'string') ||
            (displayName && typeof displayName !== 'string') ||
            (password && typeof password !== 'string') ||
            (email && typeof email !== 'string') ||
            (googleId && typeof googleId !== 'string')
        ) {
            return res.status(400).json({
                error: 'Each argument must be a string'
            })
        }
        
        if (
            username == null ||
            displayName == null ||
            email == null ||
            (googleId == null && password == null)
        ) {
            return res.status(400).json({
            error:
                'Missing argument (requires username, email, displayName, and either googleId or password)'
            })
        }
        
        let user = await prisma.account.findFirst({
            where: { username },
            select: { id: true }
        })
        
        if (user != null) {
            return res.status(409).json({ error: 'Username is taken' })
        }
        
        user = await prisma.account.findFirst({
            where: { email },
            select: { id: true }
        })
        
        if (user != null) {
            return res.status(409).json({ error: 'Account with email exists' })
        }

        let acceptableCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
		let varifyCode = '';
    	for (let i = 12; i > 0; i--) 
		{
        	varifyCode += acceptableCharacters[(Math.floor(Math.random() * acceptableCharacters.length))];
		}
        
        user = await prisma.account.create({
            data: {
                username: username,
                name: displayName,
                email: email,
                varified: false,
                varifyCode: varifyCode,
                ...(password ? { password } : {}),
                ...(googleId ? { googleId } : {})
            }
        })

        var mailOptions = {
            from: 'help.nomnomnetwork@gmail.com',
            to: email,
            subject: 'Nom Nom Network Account Verification',
            text: `Proceed to http://nomnom.network/verify?id=${user.id}&code=${varifyCode} to verify your account.`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.status(500).json({
                    error: 'Error sending verification email'
                })
            }
        });
        
        let ret = { userId: user.id, error: '' }
        return res.status(201).json(ret)
    } catch (error) {
        console.error('Error during signup:', error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}