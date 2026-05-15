import { productosService } from '../services/productos.services.js';

class ProductosController {
    constructor() { }

    obtenerTodos = async (req, res) => {
        const { message, status, data } = await productosService.obtenerTodos();
        res.status(status).json({ mensaje: message, data });
    };

    obtenerUno = async (req, res) => {
        const { message, status, data } = await productosService.obtenerUno(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };

    crear = async (req, res) => {
        const { message, status, data } = await productosService.crear(req.body);
        res.status(status).json({ mensaje: message, data });
    };

    actualizar = async (req, res) => {
        const { message, status, data } = await productosService.actualizar(req.params.id, req.body);
        res.status(status).json({ mensaje: message, data });
    };

    eliminar = async (req, res) => {
        const { message, status, data } = await productosService.eliminar(req.params.id);
        res.status(status).json({ mensaje: message, data });
    };
}

export const productosController = new ProductosController();