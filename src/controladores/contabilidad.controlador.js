import { contabilidadService } from '../services/contabilidad.services.js';

class ContabilidadController {
    constructor() {}

    obtenerCuentas = async (req, res) => {
        const { message, status, data } = await contabilidadService.obtenerCuentas();
        res.status(status).json({ mensaje: message, data });
    };

    crearCuenta = async (req, res) => {
        const { message, status, data } = await contabilidadService.crearCuenta(req.body);
        res.status(status).json({ mensaje: message, data });
    };

    obtenerAsientos = async (req, res) => {
        const { message, status, data } = await contabilidadService.obtenerAsientos();
        res.status(status).json({ mensaje: message, data });
    };

    obtenerAsientoPorId = async (req, res) => {
        const { message, status, data } = await contabilidadService.obtenerAsientoPorId(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };

    crearAsiento = async (req, res) => {
        const { message, status, data } = await contabilidadService.crearAsiento(req.body);
        res.status(status).json({ mensaje: message, data });
    };

    obtenerCaja = async (req, res) => {
        const { message, status, data } = await contabilidadService.obtenerCaja();
        res.status(status).json({ mensaje: message, data });
    };

    registrarCaja = async (req, res) => {
        const { message, status, data } = await contabilidadService.registrarCaja(req.body);
        res.status(status).json({ mensaje: message, data });
    };

    obtenerReporteVentas = async (req, res) => {
        const { fechaInicio, fechaFin } = req.query;
        const { message, status, data } = await contabilidadService.obtenerReporteVentas(fechaInicio, fechaFin);
        res.status(status).json({ mensaje: message, data });
    };
}

export const contabilidadController = new ContabilidadController();