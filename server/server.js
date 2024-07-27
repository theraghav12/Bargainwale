import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";

dotenv.config();

const PORT = 3000 || process.env.PORT;
const app = express();
connectDB();
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server listening to PORT ${PORT}`);
});