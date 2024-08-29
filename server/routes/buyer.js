import express from 'express';
import buyerController from '../controllers/buyer.js';

const router = express.Router();

// Route to create a new buyer
router.post('/api/buyers', buyerController.createBuyer);

// Route to get all buyers
router.get('/api/buyers', buyerController.getAllBuyers);

// Route to get a specific buyer by ID
router.get('/api/buyers/:id', buyerController.getBuyerById);

// Route to update a specific buyer by ID
router.put('/api/buyers/:id', buyerController.updateBuyer);

// Route to delete a specific buyer by ID
router.delete('/api/buyers/:id', buyerController.deleteBuyer);

export default router;
