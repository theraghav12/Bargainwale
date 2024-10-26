import express from "express";
import itemHistoryController from "../controllers/itemHistory.js";

const router = express.Router();

router.get('/api/:orgId/itemhistory', itemHistoryController.getAllItemHistory);

router.get('/api/:orgId/itemhistory/:id', itemHistoryController.getItemHistoryById);


export default router;
