import express from "express";
import priceController from "../controllers/itemprice.js";

const router = express.Router();

router.post("/api/add", priceController.addPrice);

router.get("/api/warehouse/:warehouseId", priceController.getPricesByWarehouse);

export default router;
