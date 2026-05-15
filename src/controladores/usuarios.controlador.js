import { usuariosService } from '../services/usuarios.services.js';

class UsuariosController {
    constructor() { }

    obtenerTodos = async (req, res) => {
        const { message, status, data } = await usuariosService.obtenerTodos();
        res.status(status).json({ mensaje: message, data });
    };

    obtenerUno = async (req, res) => {
        const { message, status, data } = await usuariosService.obtenerUno(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };

    crear = async (req, res) => {
        const { message, status, data } = await usuariosService.crear(req.body);
        res.status(status).json({ mensaje: message, data });
    };

    actualizar = async (req, res) => {
        const { message, status, data } = await usuariosService.actualizar(req.params.id, req.body);
        res.status(status).json({ mensaje: message, data });
    };

    eliminar = async (req, res) => {
        const { message, status, data } = await usuariosService.eliminar(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };
}

export const usuariosController = new UsuariosController();