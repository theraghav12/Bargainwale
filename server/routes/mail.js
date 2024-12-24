import express from "express";
import {
  sendEmail,
  retryFailedEmails,
  getAllEmails,
  getEmailById,
} from "../controllers/mail.js";

const router = express.Router();

// Route to send an email
router.post("/api/sendMail", sendEmail);

// Route to retry sending failed emails
router.post("/api/retryEmail", retryFailedEmails);

// Route to get all emails
router.get("/api/mail", getAllEmails);

// Route to get a specific email by ID
router.get("/api/mail/:id", getEmailById);

export default router;
