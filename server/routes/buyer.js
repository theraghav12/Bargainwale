import express from 'express';
import buyerController from '../controllers/buyerController.js';

const router = express.Router();

// Route to create a new buyer
router.post('/buyers', buyerController.createBuyer);

// Route to get all buyers
router.get('/buyers', buyerController.getAllBuyers);

// Route to get a specific buyer by ID
router.get('/buyers/:id', buyerController.getBuyerById);

// Route to update a specific buyer by ID
router.put('/buyers/:id', buyerController.updateBuyer);

// Route to delete a specific buyer by ID
router.delete('/buyers/:id', buyerController.deleteBuyer);

export default router;
