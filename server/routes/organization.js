import { Router } from 'express';
import orgController from "../controllers/organization.js";

const router = Router();

router.post('/api/organization', orgController.createOrganization);
router.get('/api/organization', orgController.getAllOrganizations);
router.get('/api/:clerkOrgId/organization', orgController.getOrganizationByClerkId);
router.get('/api/organization/:id', orgController.getOrganizationById);
router.put('/api/organization/:id', orgController.updateOrganization);
router.delete('/api/organization/:id', orgController.deleteOrganization);

export default router;
