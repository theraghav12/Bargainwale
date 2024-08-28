import express from 'express';
import itemController from '../controllers/itemController.js';

const router = express.Router();

// Route to create a new item
router.post('/items', itemController.createItem);

// Route to get all items
router.get('/items', itemController.getAllItems);

// Route to get a specific item by ID
router.get('/items/:id', itemController.getItemById);

// Route to update a specific item by ID
router.put('/items/:id', itemController.updateItem);

// Route to delete a specific item by ID
router.delete('/items/:id', itemController.deleteItem);

export default router;
