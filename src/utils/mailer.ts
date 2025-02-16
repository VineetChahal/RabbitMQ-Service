import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(email: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      logger.info(`✅ Email sent to ${email}`);
    } catch (error) {
      logger.error(`❌ Error sending email to ${email}: ${error}`);
    }
  }