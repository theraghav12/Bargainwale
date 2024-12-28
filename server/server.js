import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import inventoryRoutes from "./routes/warehouse.js";
import orgRoutes from "./routes/organization.js";
import setUpJobs from "./utils/jobs.js";
import bookingRoutes from "./routes/booking.js";
import transportRoutes from './routes/transport.js';
import manufacturerRoutes from './routes/manufacturer.js';
import buyerRoutes from './routes/buyer.js';
import itemRoutes from './routes/items.js';
import purchaseRoutes from './routes/purchase.js';
import saleRoutes from "./routes/sale.js";
import itempriceRoutes from "./routes/itemprice.js";
import totalSaleRoutes from "./routes/totalsale.js";
import itemHistoryRoutes from "./routes/itemHistory.js";
import mailRoutes from "./routes/mail.js";
import uploadRoutes from "./routes/excelUpload.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
connectDB();
app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
}));

app.use(userRoutes);

app.use(orderRoutes);

app.use(inventoryRoutes);

app.use(orgRoutes);

app.use(bookingRoutes);

app.use(manufacturerRoutes);

app.use(buyerRoutes);

app.use(itemRoutes);

app.use(transportRoutes);

app.use(purchaseRoutes);

app.use(saleRoutes);

app.use(itempriceRoutes);

app.use(totalSaleRoutes);

app.use(itemHistoryRoutes);

app.use(mailRoutes);

app.use(uploadRoutes);

app.listen(PORT, () => {
    console.log(`Server listening to PORT ${PORT}`);
    setUpJobs();
});