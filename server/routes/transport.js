import express from 'express';
import transportController from '../controllers/transport.js';

const router = express.Router();

// Route to create a new transport
router.post('/api/transports', transportController.createTransport);

// Route to get all transports
router.get('/api/:orgId/transports', transportController.getAllTransports);

// Route to get a specific transport by ID
router.get('/api/:orgId/transports/:id', transportController.getTransportById);

// Route to update a specific transport by ID
router.put('/api/transports/:id', transportController.updateTransport);

// Route to delete a specific transport by ID
router.delete('/api/transports/:id', transportController.deleteTransport);

export default router;
