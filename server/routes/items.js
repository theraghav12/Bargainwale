import express from 'express';
import itemController from '../controllers/items.js';

const router = express.Router();

// Route to create a new item
router.post('/api/items', itemController.createItem);

// Route to get all items
router.get('/api/items', itemController.getAllItems);

// Route to get a specific item by ID
router.get('/api/items/:id', itemController.getItemById);

// Route to update a specific item by ID
router.put('/api/items/:id', itemController.updateItem);

// Route to delete a specific item by ID
router.delete('/api/items/:id', itemController.deleteItem);

export default router;
