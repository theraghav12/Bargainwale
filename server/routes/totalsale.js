import express from 'express';
import totalSaleController from '../controllers/totalsale.js';

const router = express.Router();

// Create or update a total sale
router.post('/api/totalsales', totalSaleController.createOrUpdateTotalSale);

// Get all total sales for an organization
router.get('/api/totalsales/:orgId', totalSaleController.getAllTotalSales);
// Get total sale by ID
router.get('/api/totalsale/:orgId/:id', totalSaleController.getTotalSaleById);

// Delete a total sale
router.delete('/api/totalsale/:id', totalSaleController.deleteTotalSale);

export default router;
