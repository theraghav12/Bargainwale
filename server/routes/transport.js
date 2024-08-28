import express from 'express';
import transportController from '../controllers/transportController.js';

const router = express.Router();

// Route to create a new transport
router.post('/transports', transportController.createTransport);

// Route to get all transports
router.get('/transports', transportController.getAllTransports);

// Route to get a specific transport by ID
router.get('/transports/:id', transportController.getTransportById);

// Route to update a specific transport by ID
router.put('/transports/:id', transportController.updateTransport);

// Route to delete a specific transport by ID
router.delete('/transports/:id', transportController.deleteTransport);

export default router;
