import { Router } from 'express';
import { register, login, adminLogin } from '../controllers/auth.js';

const router = Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.post('/admin/login', adminLogin as any);

export default router;
