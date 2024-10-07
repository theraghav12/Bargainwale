import express from "express";
import priceController from "../controllers/itemprice.js";

const router = express.Router();

router.post("/api/add", priceController.addPrice);

router.get("/api/warehouseprices/:warehouseId", priceController.getPricesByWarehouse);

router.get('/api/prices', priceController.getAllPrices);

export default router;
