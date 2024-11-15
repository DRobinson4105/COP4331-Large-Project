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
        const { username, password, email, googleId } = req.body

        if (
            (username && typeof username !== 'string') ||
            (password && typeof password !== 'string') ||
            (email && typeof email !== 'string') ||
            (googleId && typeof googleId !== 'string')
        ) {
            return res.status(400).json({
            error: 'username, password, email, and googleId must be a string'
            })
        }

        if (
            (username == null && email == null) || (username == "" && email == "") ||
            (googleId == null && password == null) || (googleId == "" && password == "")
        ) {
            return res.status(400).json({
                error: 'Missing argument (requires either username or email, and either googleId or password)'
            })
        }

        let user = await prisma.account.findFirst({
            where: {
            ...(username ? { username } : {}),
            ...(email ? { email } : {}),
            ...(password ? { password } : {}),
            ...(googleId ? { googleId } : {})
            },
            select: { id: true, email: true, varifyCode: true, varified: true }
        })
        if (user == null) {
            return res.status(401).json({ error: 'Incorrect Username or Password' })
        }

        if (!user.varified) {
            var mailOptions = {
                from: 'help.nomnomnetwork@gmail.com',
                to: user.email,
                subject: 'Nom Nom Network Account Verification',
                text: `Proceed to http://nomnom.network/verify?id=${user.id}&code=${user.varifyCode} to verify your account.`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    return res.status(500).json({
                        error: 'Error sending verification email'
                    })
                }
            });
            return res.status(401).json({ error: 'Verify your account before logging in. Another email has been sent.'})
        }

        let ret = { userId: user.id, error: '' }
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