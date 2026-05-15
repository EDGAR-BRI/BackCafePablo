import { Router } from 'express';
import { productosController } from '../controladores/productos.controlador.js';

const router = Router();

router.get('/', productosController.obtenerTodos);
router.get('/:id', productosController.obtenerUno);
router.post('/', productosController.crear);
router.put('/:id', productosController.actualizar);
router.delete('/:id', productosController.eliminar);

export default router;