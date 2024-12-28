import { Router } from 'express';
import excelUploadController from "../controllers/excelUpload.js";
import { upload } from '../middleware/multer.js';

const router = Router();

router.post('/api/upload/warehouse', upload.single("file"), excelUploadController.uploadWarehouse);
router.post('/api/upload/item', upload.single("file"), excelUploadController.uploadItems);

export default router;