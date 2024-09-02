import { Router } from "express";
import saleController from "../controllers/sale.js";

const router = Router();

router.post("/api/sale", saleController.createSale);
router.get("/api/sale", saleController.getAllSales);
router.get("/api/sale/:id", saleController.getSaleById);
router.delete("/api/sale/:id", saleController.deleteSale);

export default router;
