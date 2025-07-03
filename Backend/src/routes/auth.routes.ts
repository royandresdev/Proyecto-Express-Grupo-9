import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// @ts-ignore - Express types mismatch
router.post('/register', register);
// @ts-ignore - Express types mismatch
router.post('/login', login);

export default router;
