import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import { rateLimit } from "express-rate-limit";
import xss from "xss";
import helmet from "helmet";
import validator from "validator";
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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    validate: { xForwardedForHeader: false }
});

app.use(limiter);

app.use(helmet());

app.use((req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body), (key, value) =>
        typeof value === 'string' ? xss(value) : value
    );
    req.query = JSON.parse(JSON.stringify(req.query), (key, value) =>
        typeof value === 'string' ? xss(value) : value
    );
    req.params = JSON.parse(JSON.stringify(req.params), (key, value) =>
        typeof value === 'string' ? xss(value) : value
    );
    next();
});

const sanitizeInput = (data) => {
    if (typeof data === 'string') {
        return validator.escape(data);
    }
    if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            data[key] = sanitizeInput(data[key]);
        }
    }
    return data;
};

app.use((req, res, next) => {
    req.body = sanitizeInput(req.body);
    req.query = sanitizeInput(req.query);
    req.params = sanitizeInput(req.params);
    next();
});

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