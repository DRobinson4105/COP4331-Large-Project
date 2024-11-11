import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

dotenv.config('../../.env')

export default async function handler(req, res) {
  try {
      const { email, e } = req.body

      if(email == null){
        return res.status(400).json({
            error: 'Input must contain an email input'
        })
      }

      if (
        (email && typeof email !== 'string')
      ) {
        return res.status(400).json({
        error: 'Entered email must be a string'
        })
      }

      let user = await prisma.account.findFirst({
        where: {
			email:email
        }
      })

    if (user == null) {
    	return res.status(409).json({ error: 'Account not found' })
    }

	let emailBody

	if(user.password == null)
	{
		emailBody = "You may not reset your password if your account uses google sign in. Please attempt signing in with your google account"
	} else
	{
		let acceptableCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let newPassword = '';
    	for (let i = 12; i > 0; i--) 
		{
        	newPassword += acceptableCharacters[(Math.floor(Math.random() * acceptableCharacters.length))];
		}

		await prisma.account.update({
            where: {
                id: user.id
            },
            data: {
                password: newPassword
            }
        })

		emailBody = `Hello ${user.username}, Your account has recieved a password reset request. Please log in and change your password. Here is your new password:\n\nusername: ${user.username}\npassword: ${newPassword}`
	}


      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "PLEASE FIX THIS USERNAME",
          pass: "PLEASE FIX THIS PASSWORD"
        }
      });
      
      var mailOptions = {
        from: 'help.nomnomnetwork@gmail.com',
        to: email,
        subject: 'Password Reset for Nom Nom Network',
        text: emailBody
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


      let ret = { error: ''};
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(ret)
  } catch (error) {
      console.error('Error during passwordReset:', error);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: error.message });
  } finally {
      await prisma.$disconnect();
  }
}