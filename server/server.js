import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import inventoryRoutes from "./routes/warehouse.js";
import orgRoutes from "./routes/organization.js";
<<<<<<< HEAD
import setUpJobs from "./utils/jobs.js";
=======
import bookingRoutes from "./routes/booking.js";
>>>>>>> ef6720931a69a3052f881313ba0575289d663d0e

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

app.use(bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server listening to PORT ${PORT}`);
    setUpJobs();
});