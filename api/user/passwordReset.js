import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});

var mailOptions = {
  from: 'help.nomnomnetwork@gmail.com',
  to: 'bobbymorris32304@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});