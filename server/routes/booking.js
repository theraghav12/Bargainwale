import { Router } from 'express';

import bookingController from "../controllers/booking.js";


const router = Router();

router.post('/api/booking', bookingController.createBooking);
router.get('/api/:orgId/booking', bookingController.getAllBookings);
router.get('/api/:orgId/booking/:id', bookingController.getBookingById);
router.put('/api/booking/:id', bookingController.updateBooking);
router.delete('/api/booking/:id', bookingController.deleteBooking);
router.get('/api/booking/buyer/:buyerId', bookingController.getBookingsByBuyerId);

export default router;
