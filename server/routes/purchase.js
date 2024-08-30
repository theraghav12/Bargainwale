import { Router } from "express";
import purchaseController from "../controllers/purchase.js";

const router = Router();

router.post("/api/purchase", purchaseController.createPurchase);
router.get("/api/purchase", purchaseController.getAllPurchases);
router.get("/api/purchase/:id", purchaseController.getPurchaseById);
router.delete("/api/purchase/:id", purchaseController.deletePurchase);

export default router;
