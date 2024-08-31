import { Router } from 'express';
import warehouseController from '../controllers/warehouse.js';

const router = Router();

router.post('/api/warehouse', warehouseController.createWarehouse);
router.get('/api/warehouse', warehouseController.getAllWarehouses);
router.get("/api/warehouse/filter", warehouseController.getWarehouseByFilter);
router.get('/api/warehouse/:id', warehouseController.getWarehouseById);
router.put('/api/warehouse/:id', warehouseController.updateWarehouse);
router.put(
  "/api/warehouse/addInventoryItem/:id",
  warehouseController.addInventoryItem
);
router.put(
  "/api/warehouse/deleteInventoryItem/:id",
  warehouseController.deleteInventoryItem
);
router.delete('/api/warehouse/:id', warehouseController.deleteWarehouse);

export default router;