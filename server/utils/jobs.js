import cron from "node-cron";
import sender from "../config/emailConfig.js";
import orderController from "../controllers/order.js";
import bookingController from "../controllers/booking.js";

const setUpJobs = () => {
  cron.schedule("* 22 * * *", async () => {
    try {
      const ordersToNotify = await orderController.fetchPendingRemindersToday();
      console.log(ordersToNotify);

      ordersToNotify.forEach((order) => {
        // Calculate the last date of payment
        const paymentDays = order.paymentDays || 21; // Default to 21 days if not specified
        const companyBargainDate = new Date(order.companyBargainDate);
        const lastDateOfPayment = new Date(companyBargainDate);
        lastDateOfPayment.setDate(companyBargainDate.getDate() + paymentDays);

        const htmlContent = `
          <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <style>
    :root {
      --background-color: #f4f4f4;
      --text-color: #333;
      --container-bg: #ffffff;
      --table-header-bg: #f1f1f1;
      --table-row-bg: #ffffff;
      --table-row-alt-bg: #f9f9f9;
      --table-border-color: #ddd;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --background-color: #333;
        --text-color: #f4f4f4;
        --container-bg: #2c2c2c;
        --table-header-bg: #444;
        --table-row-bg: #2c2c2c;
        --table-row-alt-bg: #3c3c3c;
        --table-border-color: #555;
      }
    }

    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--background-color);
      color: var(--text-color);
      scrollbar-width: thin;
      scrollbar-color: #888 #333;
    }

    .container {
      width: 80%;
      margin: auto;
      background: var(--container-bg);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      color: var(--text-color);
    }

    h1 {
      color: var(--text-color);
      margin-bottom: 20px;
    }

    p {
      color: var(--text-color);
      margin-bottom: 20px;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: var(--text-color);
    }

    th, td {
      padding: 8px;
      border: 1px solid var(--table-border-color);
      text-align: left;
    }

    th {
      background-color: var(--table-header-bg);
    }

    tr:nth-child(even) {
      background-color: var(--table-row-bg);
    }

    tr:nth-child(odd) {
      background-color: var(--table-row-alt-bg);
    }

    tr:hover {
      background-color: var(--table-row-alt-bg);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Payment Reminder</h1>
    <p>Hello,</p>
    <p>This is a reminder that your payment for the following items is due soon for seller ${order.sellerName}. Please make sure to complete the payment to avoid any inconvenience.</p>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Packaging</th>
            <th>Type</th>
            <th>Weight</th>
            <th>Quantity</th>
            <th>Static Price</th>
            <th>Total Price</th>
            <th>Bargain Date</th>
            <th>Last Date of Payment</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.packaging}</td>
              <td>${item.type || "N/A"}</td>
              <td>${item.weight} kg</td>
              <td>${item.quantity}</td>
              <td>$${item.staticPrice.toFixed(2)}</td>
              <td>$${(item.staticPrice * item.quantity).toFixed(2)}</td>
              <td>${
                order.companyBargainDate
                  ? new Date(order.companyBargainDate).toLocaleDateString()
                  : "N/A"
              }</td>
              <td>${
                lastDateOfPayment
                  ? lastDateOfPayment.toLocaleDateString()
                  : "N/A"
              }</td>
            </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <p>If you have already made the payment, please disregard this email.</p>
    <p>Thank you!</p>
  </div>
</body>
</html>
        `;

        sender.sendMail(
          {
            to: order.sellerContact, 
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

      console.log("Pending reminders processed:", ordersToNotify);
    } catch (error) {
      console.error("Error fetching pending reminders:", error);
    }
  });
  cron.schedule("* 22 * * *", async () => {
    try {
      const bookingsToNotify =await bookingController.fetchPendingRemindersToday();
      // console.log("Hellloooooo   ",bookingsToNotify);

      bookingsToNotify.forEach((booking) => {
        // Calculate the last date of payment
        const paymentDays = booking.paymentDays || 21; // Default to 21 days if not specified
        const companyBargainDate = new Date(booking.companyBargainDate);
        const lastDateOfPayment = new Date(companyBargainDate);
        lastDateOfPayment.setDate(companyBargainDate.getDate() + paymentDays);

        const htmlContent = `
          <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <style>
    :root {
      --background-color: #f4f4f4;
      --text-color: #333;
      --container-bg: #ffffff;
      --table-header-bg: #f1f1f1;
      --table-row-bg: #ffffff;
      --table-row-alt-bg: #f9f9f9;
      --table-border-color: #ddd;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --background-color: #333;
        --text-color: #f4f4f4;
        --container-bg: #2c2c2c;
        --table-header-bg: #444;
        --table-row-bg: #2c2c2c;
        --table-row-alt-bg: #3c3c3c;
        --table-border-color: #555;
      }
    }

    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: var(--background-color);
      color: var(--text-color);
      scrollbar-width: thin;
      scrollbar-color: #888 #333;
    }

    .container {
      width: 80%;
      margin: auto;
      background: var(--container-bg);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      color: var(--text-color);
    }

    h1 {
      color: var(--text-color);
      margin-bottom: 20px;
    }

    p {
      color: var(--text-color);
      margin-bottom: 20px;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      color: var(--text-color);
    }

    th, td {
      padding: 8px;
      border: 1px solid var(--table-border-color);
      text-align: left;
    }

    th {
      background-color: var(--table-header-bg);
    }

    tr:nth-child(even) {
      background-color: var(--table-row-bg);
    }

    tr:nth-child(odd) {
      background-color: var(--table-row-alt-bg);
    }

    tr:hover {
      background-color: var(--table-row-alt-bg);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Booking Reminder</h1>
    <p>Hello,</p>
    <p>This is a reminder that your booking for the following items is due soon for seller ${booking.sellerName}. Please make sure to complete any pending actions to avoid any inconvenience.</p>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Packaging</th>
            <th>Type</th>
            <th>Weight</th>
            <th>Quantity</th>
            <th>Static Price</th>
            <th>Total Price</th>
            <th>Bargain Date</th>
            <th>Last Date of Booking</th>
          </tr>
        </thead>
        <tbody>
          ${booking.items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.packaging}</td>
              <td>${item.type || "N/A"}</td>
              <td>${item.weight} kg</td>
              <td>${item.quantity}</td>
              <td>$${item.staticPrice.toFixed(2)}</td>
              <td>$${(item.staticPrice * item.quantity).toFixed(2)}</td>
              <td>${
                booking.companyBargainDate
                  ? new Date(booking.companyBargainDate).toLocaleDateString()
                  : "N/A"
              }</td>
              <td>${
                lastDateOfPayment
                  ? lastDateOfPayment.toLocaleDateString()
                  : "N/A"
              }</td>
            </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <p>If you have already completed the booking, please disregard this email.</p>
    <p>Thank you!</p>
  </div>
</body>
</html>
        `;

        sender.sendMail(
          {
            to: booking.buyer.buyerContact,
            subject: "Booking Reminder",
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

      console.log("Pending reminders processed:", bookingsToNotify);
    } catch (error) {
      console.error("Error fetching pending reminders:", error);
    }
  });
};

export default setUpJobs;
