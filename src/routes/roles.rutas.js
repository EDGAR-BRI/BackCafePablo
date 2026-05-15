import { Router } from 'express';
import { rolesController } from '../controladores/roles.controlador.js';

const router = Router();

router.get('/', rolesController.obtenerTodos);
router.get('/:id', rolesController.obtenerUno);
router.post('/', rolesController.crear);
router.put('/:id', rolesController.actualizar);
router.delete('/:id', rolesController.eliminar);

export default router;