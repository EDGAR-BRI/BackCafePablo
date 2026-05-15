import prisma from '../config/prisma.config.js';

export class MesasService {
    constructor() {}

    obtenerTodos = async () => {
        try {
            const data = await prisma.mesa.findMany({ where: { estado: true } });
            return { message: 'Mesas listadas', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    obtenerUno = async (id) => {
        try {
            const data = await prisma.mesa.findUnique({ where: { id: parseInt(id) } });
            if (!data || !data.estado) return { message: 'Mesa no encontrada', status: 404, data: null };
            return { message: 'Mesa encontrada', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    crear = async (body) => {
        try {
            const data = await prisma.mesa.create({ data: body });
            return { message: 'Mesa creada', status: 201, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    actualizar = async (id, body) => {
        try {
            const data = await prisma.mesa.update({ where: { id: parseInt(id) }, data: body });
            return { message: 'Mesa actualizada', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    eliminar = async (id) => {
        try {
            const data = await prisma.mesa.update({ where: { id: parseInt(id) }, data: { estado: false } });
            return { message: 'Mesa eliminada/deshabilitada', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };
}

export const mesasService = new MesasService();
