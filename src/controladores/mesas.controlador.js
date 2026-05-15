import { mesasService } from '../services/mesas.services.js';

class MesasController {
    constructor() { }

    obtenerTodos = async (req, res) => {
        const { message, status, data } = await mesasService.obtenerTodos();
        res.status(status).json({ mensaje: message, data });
    };

    obtenerUno = async (req, res) => {
        const { message, status, data } = await mesasService.obtenerUno(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };

    crear = async (req, res) => {
        const { message, status, data } = await mesasService.crear(req.body);
        res.status(status).json({ mensaje: message, data });
    };

    actualizar = async (req, res) => {
        const { message, status, data } = await mesasService.actualizar(req.params.id, req.body);
        res.status(status).json({ mensaje: message, data });
    };

    eliminar = async (req, res) => {
        const { message, status, data } = await mesasService.eliminar(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };
}

export const mesasController = new MesasController();
