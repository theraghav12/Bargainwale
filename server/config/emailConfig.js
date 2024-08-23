import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sender = nodeMailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default sender;
