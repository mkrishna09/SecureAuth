import nodemailer from "nodemailer";
import config from "../config/env";

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  await transporter.sendMail({
    from: config.mail.from,
    to,
    subject,
    html,
  });
}