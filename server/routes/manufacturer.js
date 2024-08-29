import express from 'express';
import manufacturerController from '../controllers/manufacturer.js';

const router = express.Router();

// Route to create a new manufacturer
router.post('/api/manufacturers', manufacturerController.createManufacturer);

// Route to get all manufacturers
router.get('/api/manufacturers', manufacturerController.getAllManufacturers);

// Route to get a specific manufacturer by ID
router.get('/api/manufacturers/:id', manufacturerController.getManufacturerById);

// Route to update a specific manufacturer by ID
router.put('/api/manufacturers/:id', manufacturerController.updateManufacturer);

// Route to delete a specific manufacturer by ID
router.delete('/api/manufacturers/:id', manufacturerController.deleteManufacturer);

export default router;
