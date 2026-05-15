import { Router } from 'express';
import { mesasController } from '../controladores/mesas.controlador.js';

const router = Router();

router.get('/', mesasController.obtenerTodos);
router.get('/:id', mesasController.obtenerUno);
router.post('/', mesasController.crear);
router.put('/:id', mesasController.actualizar);
router.delete('/:id', mesasController.eliminar);

export default router;
