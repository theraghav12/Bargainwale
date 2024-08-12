import { Router } from 'express';
import warehouseController from '../controllers/warehouse.js';

const router = Router();

router.post('/api/warehouse', warehouseController.createWarehouse);
router.get('/api/warehouse', warehouseController.getAllWarehouses);
router.get('/api/warehouse/:id', warehouseController.getWarehouseById);
router.put('/api/warehouse/:id', warehouseController.updateWarehouse);
router.delete('/api/warehouse/:id', warehouseController.deleteWarehouse);

export default router;