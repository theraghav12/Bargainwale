import express from 'express';
import manufacturerController from '../controllers/manufacturer.js';

const router = express.Router();

// Route to create a new manufacturer
router.post('/manufacturers', manufacturerController.createManufacturer);

// Route to get all manufacturers
router.get('/manufacturers', manufacturerController.getAllManufacturers);

// Route to get a specific manufacturer by ID
router.get('/manufacturers/:id', manufacturerController.getManufacturerById);

// Route to update a specific manufacturer by ID
router.put('/manufacturers/:id', manufacturerController.updateManufacturer);

// Route to delete a specific manufacturer by ID
router.delete('/manufacturers/:id', manufacturerController.deleteManufacturer);

export default router;
