import { Router } from 'express';
import { authController } from '../controladores/auth.controlador.js';

const router = Router();

router.post('/login', authController.login);

export default router;
