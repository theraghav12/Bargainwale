import cron from "node-cron";
import sender from "../config/emailConfig.js";
import orderController from "../controllers/order.js";

const setUpJobs = () => {
  cron.schedule("*/2 * * * *", async () => {
    try {
      const emailsToNotify = await orderController.fetchPendingRemindersToday();

      emailsToNotify.forEach((email) => {
        const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 80%;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Reminder</h1>
          <p>Hello,</p>
          <p>This is a reminder that your payment is due soon. Please make sure to complete the payment to avoid any inconvenience.</p>
          <p>If you have already made the payment, please disregard this email.</p>
          <p>Thank you!</p>
        </div>
      </body>
    </html>
  `;
        sender.sendMail(
          {
            to: email,
            subject: "Payment Reminder",
            html: htmlContent,
          },
          async (err, data) => {
            if (err) {
              console.log("Error sending email:", err);
            } else {
              console.log("Email sent successfully:", data);
            }
          }
        );
      });

      console.log("Pending reminders processed:", emailsToNotify);
    } catch (error) {
      console.error("Error fetching pending reminders:", error);
    }
  });
};

export default setUpJobs;
