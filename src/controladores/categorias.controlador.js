import { categoriasService } from '../services/categorias.services.js';

class CategoriasController {
    constructor() { }

    obtenerTodos = async (req, res) => {
        const { message, status, data } = await categoriasService.obtenerTodos();
        res.status(status).json({ mensaje: message, data });
    };

    obtenerUno = async (req, res) => {
        const { message, status, data } = await categoriasService.obtenerUno(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };

    crear = async (req, res) => {
        const { message, status, data } = await categoriasService.crear(req.body);
        res.status(status).json({ mensaje: message, data });
    };

    actualizar = async (req, res) => {
        const { message, status, data } = await categoriasService.actualizar(req.params.id, req.body);
        res.status(status).json({ mensaje: message, data });
    };

    eliminar = async (req, res) => {
        const { message, status, data } = await categoriasService.eliminar(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };
}

export const categoriasController = new CategoriasController();