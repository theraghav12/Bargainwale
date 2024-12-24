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
        <td>${item.quantity}</td>
        <td>${item.baseRate}</td>
        <td>${item.taxpaidAmount}</td>
        <td>${item.taxableAmount}</td>
      </tr>
    `;
    })
    .join("");

  const emailBody = `
    <h1>Order Details</h1>
    <p><strong>Company Bargain No:</strong> ${companyBargainNo}</p>
    <p><strong>Date:</strong> ${new Date(
      companyBargainDate
    ).toLocaleDateString()}</p>
    <p><strong>Status:</strong> ${status}</p>
    <table border="1">
      <thead>
        <tr>
          <th>Item</th>
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
    <p><strong>Total Amount:</strong> ${totalAmount}</p>
  `;

  const subject = `Order Confirmation - ${companyBargainNo}`;

  return { subject, body: emailBody };
};
