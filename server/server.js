import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import inventoryRoutes from "./routes/inventory.js";
import orgRoutes from "./routes/organization.js";

dotenv.config();

const PORT = 3000 || process.env.PORT;
const app = express();
connectDB();
app.use(express.json());
app.use(cors());

app.use(userRoutes);

app.use(orderRoutes);

app.use(inventoryRoutes);

app.use(orgRoutes);

app.listen(PORT, () => {
    console.log(`Server listening to PORT ${PORT}`);
});