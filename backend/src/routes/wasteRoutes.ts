import { Router } from 'express';
import { scanWaste, getWasteHistory } from '../controllers/wasteController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/scan',    auth, scanWaste);       // POST /api/waste/scan
router.get('/history',  auth, getWasteHistory); // GET  /api/waste/history

export default router;
