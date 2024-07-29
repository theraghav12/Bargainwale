import { Router } from 'express';
import inventoryController from '../controllers/inventory.js';

const router = Router();

router.post('/api/inventory', inventoryController.createInventoryItem);
router.get('/api/inventory', inventoryController.getAllInventoryItems);
router.get('/api/inventory/:id', inventoryController.getInventoryItemById);
router.put('/api/inventory/:id', inventoryController.updateInventoryItem);
router.delete('/api/inventory/:id', inventoryController.deleteInventoryItem);

export default router;