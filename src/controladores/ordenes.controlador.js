import { ordenesService } from '../services/ordenes.services.js';

class OrdenesController {
    constructor() {}

    obtenerTodos = async (req, res) => {
        const { message, status, data } = await ordenesService.obtenerTodos();
        res.status(status).json({ mensaje: message, data });
    };

    crear = async (req, res) => {
        const { message, status, data } = await ordenesService.crear(req.body);
        res.status(status).json({ mensaje: message, data });
    };

    pagar = async (req, res) => {
        const { message, status, data } = await ordenesService.pagar(req.params.id, req.body);
        res.status(status).json({ mensaje: message, data });
    };

    eliminar = async (req, res) => {
        const { message, status, data } = await ordenesService.eliminar(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };
}

export const ordenesController = new OrdenesController();
