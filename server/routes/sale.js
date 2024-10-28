import { Router } from "express";
import saleController from "../controllers/sale.js";

const router = Router();

router.post("/api/sale", saleController.createSale);
router.get("/api/:orgId/sale", saleController.getAllSales);
router.get("/api/:orgId/sale/:id", saleController.getSaleById);
router.get("/api/sales-between-dates", saleController.getSalesBetweenDates);
router.delete("/api/sale/:id", saleController.deleteSale);

export default router;
