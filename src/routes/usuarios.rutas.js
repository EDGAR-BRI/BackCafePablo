import { Router } from 'express';
import { usuariosController } from '../controladores/usuarios.controlador.js';
import validateUser from '../validators/users.validator.js';

const router = Router();

router.get('/', usuariosController.obtenerTodos);
router.get('/:id', usuariosController.obtenerUno);
router.post('/', validateUser, usuariosController.crear);
router.put('/:id', validateUser, usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

export default router;