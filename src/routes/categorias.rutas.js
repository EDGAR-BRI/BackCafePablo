import { Router } from 'express';
import { categoriasController } from '../controladores/categorias.controlador.js';

const router = Router();

router.get('/', categoriasController.obtenerTodos);
router.get('/:id', categoriasController.obtenerUno);
router.post('/', categoriasController.crear);
router.put('/:id', categoriasController.actualizar);
router.delete('/:id', categoriasController.eliminar);

export default router;