import { Router } from 'express';
import { ordenesController } from '../controladores/ordenes.controlador.js';

const router = Router();

router.get('/', ordenesController.obtenerTodos);
router.post('/', ordenesController.crear);
router.put('/:id/pagar', ordenesController.pagar);
router.delete('/:id', ordenesController.eliminar);

export default router;
