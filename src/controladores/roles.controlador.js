import { rolesService } from '../services/roles.services.js';

class RolesController {
    constructor() { }

    obtenerTodos = async (req, res) => {
        const { message, status, data } = await rolesService.obtenerTodos();
        res.status(status).json({ mensaje: message, data });
    };

    obtenerUno = async (req, res) => {
        const { message, status, data } = await rolesService.obtenerUno(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };

    crear = async (req, res) => {
        const { message, status, data } = await rolesService.crear(req.body);
        res.status(status).json({ mensaje: message, data });
    };

    actualizar = async (req, res) => {
        const { message, status, data } = await rolesService.actualizar(req.params.id, req.body);
        res.status(status).json({ mensaje: message, data });
    };

    eliminar = async (req, res) => {
        const { message, status, data } = await rolesService.eliminar(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };
}

export const rolesController = new RolesController();
