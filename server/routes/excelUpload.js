import { Router } from 'express';
import excelUploadController from "../controllers/excelUpload.js";
import { upload } from '../middleware/multer.js';

const router = Router();

router.post('/api/upload/warehouse', upload.single("file"), excelUploadController.uploadWarehouse);
router.post('/api/upload/item', upload.single("file"), excelUploadController.uploadItems);
router.post('/api/upload/transport', upload.single("file"), excelUploadController.uploadTransport);
router.post('/api/upload/buyer', upload.single("file"), excelUploadController.uploadBuyer);
router.post('/api/upload/manufacturer', upload.single("file"), excelUploadController.uploadManufacturer);

export default router;