import { Router } from 'express';
import { contabilidadController } from '../controladores/contabilidad.controlador.js';

const router = Router();

router.get('/cuentas-contables', contabilidadController.obtenerCuentas);
router.post('/cuentas-contables', contabilidadController.crearCuenta);

router.get('/asientos', contabilidadController.obtenerAsientos);
router.get('/asientos/:id', contabilidadController.obtenerAsientoPorId);
router.post('/asientos', contabilidadController.crearAsiento);

router.get('/caja', contabilidadController.obtenerCaja);
router.post('/caja', contabilidadController.registrarCaja);

router.get('/reportes/ventas', contabilidadController.obtenerReporteVentas);

export default router;