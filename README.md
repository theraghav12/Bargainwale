# 🛒 Bargainwale.com

**Bargainwale** is a B2B supply-chain and procurement platform tailored for the edible oil and FMCG industry. It digitizes critical business workflows such as inventory planning, dynamic pricing, order processing, bookings, procurement, and sales. With built-in dashboards and analytics, the platform empowers businesses with real-time visibility and operational control.

---

## Features Overview

### Home Dashboard
- Summary Cards for:
  - Orders
  - Bookings
  - Order Revenue
  - Booking Value
- Daily Booking Chart
- Item Price Update Panel for SKUs:
  - Company Price
  - Rack Price
  - Depot Price
  - Plant Price
- Price History Tracker (Table + Bar Chart)
- Export Price Trends to Excel

---

### Master Configuration
Manage core entities:
- **Warehouses**: Add/edit distribution centers, manage activation
- **Items**: Define SKUs, packaging, weight, unit availability
- **Transport Vendors**: Manage logistics partners
- **Buyers**: Retailers & distributors with contact and GST info
- **Manufacturers**: Define and track production partners
- **Bulk Uploads**: Excel import support for fast setup
- **Enable/Disable Entities** without deletion

---

### Inventory Management
Track inventory in 3 types per warehouse:
- **Virtual Inventory**
  - Increases on order creation
  - Decreases on booking
- **Billed Inventory**
  - Increases after purchase entry
  - Decreases after sale
- **Booked Inventory**
  - Increases on booking confirmation
  - Decreases on sale fulfillment
- Warehouse & City Filters for granular view

---

### Orders Section
#### 1. Create Order
- Use company Bargain Number
- Add item rows with pickup, base price, quantity

#### 2. Order History
- Filterable/searchable log with expandable item rows
- Download option (Excel)

#### 3. Order Analytics
- Daily Order Count
- Order Status Distribution (Created, Partially Paid, Billed)
- Revenue via Orders

---

### Bookings Section
#### 1. Create Booking
- Allocate inventory, apply discounts, lock delivery mode

#### 2. Booking History
- Timeline with item details, GST, source, discount %, quantity

#### 3. Booking Analytics
- Total Bookings, Revenue
- Booking Status Breakdown
- Trends Over Time

#### 4. Discount Approval
- Admin panel to approve/reject discounts
- Side-by-side comparison of original and discounted prices

---

### Purchase Section
#### 1. Create Purchase
- Convert Order to Purchase
- Enter invoice number, pickup point, quantity

#### 2. Purchase History
- Filterable purchase records
- Expand for packaging/item quantity breakdown

#### 3. Purchase Analytics
- Vendor performance
- Volume-based trend analysis

---

### 📤 Sales Section
#### 1. Create Sale
- Allocate inventory using Booking ID
- Update booked/billed inventory accordingly

#### 2. Sales History
- Track sales with buyer contact, pricing, GST

#### 3. Sales Analytics
- Revenue
- Booking-to-Sale conversion
- Sales Trend Dashboard

---

### 🏢 Organization Settings
- **General Info**: GSTIN, FSSAI, address, company details
- **Members**: Invite users via email, set roles (Admin, Member), remove inactive members

---

## 📊 Tech Stack 

- **Frontend**: React.js / Next.js
- **Backend**: Node.js / Express 
- **Database**:  MongoDB
- **Charts**: Chart.js / D3.js
- **Auth**: JWT/Cleark

---


## 📦 Who Is It For?

Bargainwale is built for:
- Manufacturers looking to reach bulk buyers
- Traders and wholesalers managing large product catalogs
- B2B businesses transitioning from offline to online
- Distributors seeking operational efficiency

---

## 🚀 Vision

To digitize India's B2B trade ecosystem by offering a platform that simplifies operations, increases visibility, and enables seamless commerce across the country.

---

## 📬 Contact

For support or inquiries:

- 📧 Email: [support@bargainwale.com](mailto:support@bargainwale.com)
- 🌐 Website: [https://www.bargainwale.com](https://www.bargainwale.com)

---

## 📄 License

Proprietary – All rights reserved by Bargainwale.
