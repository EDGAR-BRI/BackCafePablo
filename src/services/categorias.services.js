import prisma from '../config/prisma.config.js';

export class CategoriasService {
    constructor() { }

    obtenerTodos = async () => {
        try {
            const data = await prisma.categoria.findMany({ where: { estado: true } });
            return { message: 'Categorías listadas', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    obtenerUno = async (id) => {
        try {
            const data = await prisma.categoria.findUnique({ where: { id: parseInt(id) } });
            if (!data || !data.estado) return { message: 'No encontrado', status: 404, data: null };
            return { message: 'Encontrado', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    crear = async (body) => {
        try {
            const data = await prisma.categoria.create({ data: body });
            return { message: 'Categoría creada', status: 201, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    actualizar = async (id, body) => {
        try {
            const data = await prisma.categoria.update({ where: { id: parseInt(id) }, data: body });
            return { message: 'Categoría actualizada', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    eliminar = async (id) => {
        try {
            const data = await prisma.categoria.update({ where: { id: parseInt(id) }, data: { estado: false } });
            return { message: 'Categoría eliminada', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };
}

export const categoriasService = new CategoriasService();