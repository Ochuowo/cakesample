import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// configure the transporter for nodemailer to use gmail account to send mails
// const transporter = nodemailer.createTransport({
// 	service: 'gmail',
// 	secure: false,
// 	auth: {
// 		//type: 'OAuth2',
// 		user: process.env.MAIL_USERNAME,
// 		pass: process.env.MAIL_PASSWORD,
// 		// clientId: process.env.OAUTH_CLIENT_ID,
// 		// clientSecret: process.env.OAUTH_CLIENT_SECRET,
// 		// refreshToken: process.env.OAUTH_REFRESH_TOKEN,
// 	},
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
   },
  });


export default transporter;
