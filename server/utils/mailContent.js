// orderEmailHelper.js
export const generateOrderEmailContent = (order) => {
  const {
    companyBargainDate,
    items,
    companyBargainNo,
    totalAmount,
    status,
  } = order;

  const orderItemsHTML = items
    .map((item) => {
      return `
      <tr>
        <td>${item._id}</td>
        <td>${item.pickup}</td>
        <td>${item.quantity}</td>
        <td>${item.baseRate}</td>
        <td>${item.taxableAmount}</td>
        <td>${item.taxpaidAmount}</td>
      </tr>
    `;
    })
    .join("");

  const emailBody = `
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    h1 {
      color: #4CAF50;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      margin: 5px 0;
    }
    strong {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    tbody tr:hover {
      background-color: #f1f1f1;
    }
    .total-amount {
      font-size: 18px;
      font-weight: bold;
      color: #4CAF50;
      margin-top: 20px;
    }
  </style>
  
  <div class="container">
    <h1>Order Details</h1>
    <p><strong>Company Bargain No:</strong> ${companyBargainNo}</p>
    <p><strong>Date:</strong> ${new Date(
      companyBargainDate
    ).toLocaleDateString()}</p>
    <p><strong>Status:</strong> ${status}</p>
    
    <table>
      <thead>
        <tr>
          <th>Item Id</th>
          <th>Item PickUp</th>
          <th>Quantity</th>
          <th>Base Rate</th>
          <th>Tax Paid Amount</th>
          <th>Taxable Amount</th>
        </tr>
      </thead>
      <tbody>
        ${orderItemsHTML}
      </tbody>
    </table>
    
    <p class="total-amount"><strong>Total Amount:</strong> ${totalAmount}</p>
  </div>
`;

  const subject = `Order Confirmation - ${companyBargainNo}`;

  return { subject, body: emailBody };
};

export const generatePurchaseEmailContent = (purchase) => {
  const {
    invoiceNumber,
    invoiceDate,
    items,
    warehouseId,
    transporterId,
    organization,
  } = purchase;

  const purchaseItemsHTML = items
    .map((item) => {
      return `
      <tr>
        <td>${item.itemId}</td>
        <td>${item.pickup}</td>
        <td>${item.quantity}</td>
      </tr>
    `;
    })
    .join("");

  const emailBody = `
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    h1 {
      color: #4CAF50;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      margin: 5px 0;
    }
    strong {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    tbody tr:hover {
      background-color: #f1f1f1;
    }
  </style>
  
  <div class="container">
    <h1>Purchase Details</h1>
    <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
    <p><strong>Invoice Date:</strong> ${new Date(
      invoiceDate
    ).toLocaleDateString()}</p>
    <p><strong>Warehouse:</strong> ${warehouseId}</p>
    <p><strong>Transporter:</strong> ${transporterId}</p>
    <p><strong>Organization:</strong> ${organization}</p>
    
    <table>
      <thead>
        <tr>
          <th>Item Id</th>
          <th>PickUp</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${purchaseItemsHTML}
      </tbody>
    </table>
  </div>
`;

  const subject = `Purchase Confirmation - ${invoiceNumber}`;

  return { subject, body: emailBody };
};


export const generateBookingEmailContent =  (booking) => {
  const {
    BargainDate,
    BargainNo,
    items,
    totalAmount,
    discountStatus,
    deliveryOption,
    buyer,
    deliveryAddress,
  } = booking;
  console.log('...', booking);
  const bookingItemsHTML = items
    .map((item) => {
      return `
        <tr>
          <td>${item.item}</td>
          <td>${item.pickup}</td>
          <td>${item.quantity}</td>
          <td>${item.basePrice?.toFixed(2)}</td>
          <td>${item.taxableAmount?.toFixed(2)}</td>
          <td>${item.taxpaidAmount?.toFixed(2)}</td>
          <td>${item.gst?.toFixed(2)}</td>
          <td>${item.cgst?.toFixed(2)}</td>
          <td>${item.sgst?.toFixed(2)}</td>
          <td>${item.igst?.toFixed(2)}</td>
          <td>${item.gstAmount?.toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  const emailBody = `
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
      h1 {
        color: #4CAF50;
        font-size: 24px;
        margin-bottom: 10px;
      }
      p {
        font-size: 16px;
        margin: 5px 0;
      }
      strong {
        color: #333;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        padding: 10px;
        text-align: left;
        border: 1px solid #ddd;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      tbody tr:hover {
        background-color: #f1f1f1;
      }
      .total-amount {
        font-size: 18px;
        font-weight: bold;
        color: #4CAF50;
        margin-top: 20px;
      }
    </style>

    <div class="container">
      <h1>Booking Details</h1>
      <p><strong>Bargain No:</strong> ${BargainNo}</p>
      <p><strong>Date:</strong> ${new Date(
        BargainDate
      ).toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${discountStatus}</p>
      <p><strong>Delivery Option:</strong> ${deliveryOption}</p>
      <p><strong>Buyer:</strong> ${buyer}</p>

      <p><strong>Delivery Address:</strong> ${
        deliveryAddress
          ? `${deliveryAddress.addressLine1}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pinCode}`
          : "N/A"
      }</p>

      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>PickUp</th>
            <th>Quantity</th>
            <th>Base Price</th>
            <th>Taxable Amount</th>
            <th>Tax Paid Amount</th>
            <th>GST</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>IGST</th>
            <th>GST Amount</th>
          </tr>
        </thead>
        <tbody>
          ${bookingItemsHTML}
        </tbody>
      </table>

      <p class="total-amount"><strong>Total Amount:</strong> ${totalAmount}</p>
    </div>
  `;

  const subject = `Booking Confirmation - ${BargainNo}`;

  return { subject, body: emailBody };
};

export const generateSalesEmailContent = (sale) => {
  const { invoiceNumber, invoiceDate, items, warehouseId, transporterId, organization } = sale;

  const saleItemsHTML = items
    .map((item) => {
      return `
        <tr>
          <td>${item.itemId}</td>
          <td>${item.quantity}</td>
          <td>${item.pickup}</td>
        </tr>
      `;
    })
    .join("");

  const emailBody = `
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
      h1 {
        color: #4CAF50;
        font-size: 24px;
        margin-bottom: 10px;
      }
      p {
        font-size: 16px;
        margin: 5px 0;
      }
      strong {
        color: #333;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        padding: 10px;
        text-align: left;
        border: 1px solid #ddd;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .total-amount {
        font-size: 18px;
        font-weight: bold;
        color: #4CAF50;
        margin-top: 20px;
      }
    </style>

    <div class="container">
      <h1>Sale Invoice - ${invoiceNumber}</h1>
      <p><strong>Invoice Date:</strong> ${new Date(
        invoiceDate
      ).toLocaleDateString()}</p>
      <p><strong>Warehouse:</strong> ${warehouseId}</p>
      <p><strong>Transporter:</strong> ${transporterId}</p>
      <p><strong>Organization:</strong> ${organization}</p>

      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Quantity</th>
            <th>PickUp</th>
          </tr>
        </thead>
        <tbody>
          ${saleItemsHTML}
        </tbody>
      </table>

      <p class="total-amount"><strong>Invoice Number:</strong> ${invoiceNumber}</p>
    </div>
  `;

  const subject = `Sale Invoice - ${invoiceNumber}`;

  return { subject, body: emailBody };
};