import * as nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from 'next'

interface ISendEmailOptions {
  toEmail: string;
  subject: string;
  text: string;
  html?: string;
}

async function validateCaptcha(token: string): Promise<boolean> {
  const secret_key = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SECRET_KEY;
  console.log("secret_key = ", secret_key);
  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`, { method: 'post' });
    const jsonResponse = await response.json();
    if (jsonResponse.success && jsonResponse.score > 0.5) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, subject, message, token } = req.body
  const validation = validateCaptcha(token || "").then(result => {
    if (result) {
      const transporter = nodemailer.createTransport({
        host: process.env.host,
        port: Number(process.env.port) || 0,
        auth: {
          user: process.env.mail,
          pass: process.env.password,
        },
      });

      const msg = {
        from: process.env.mail,
        to: 'Contact@babylonia.app',
        subject: `${subject} (Email: ${email})`,
        text: message,
        // html: html,
      };
      // Send mail
      transporter.sendMail(msg);
      res.status(200).end(JSON.stringify({ message: 'Email sent' }))
    } else {
      return false;
    }
  }).catch(error => {
    console.log("error = ", error);
    return false;
  });



};
