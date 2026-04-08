import { Router } from 'express';
import wasteRoutes    from './wasteRoutes';
import recyclerRoutes from './recyclerRoutes';
import userRoutes     from './userRoutes';

const router = Router();

router.use('/waste',     wasteRoutes);
router.use('/recyclers', recyclerRoutes);
router.use('/auth',      userRoutes);

export default router;
