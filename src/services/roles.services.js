import prisma from '../config/prisma.config.js';

export class RolesService {
    constructor() {}

    obtenerTodos = async () => {
        try {
            const data = await prisma.rol.findMany({ where: { estado: true } });
            return { message: 'Roles listados', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    obtenerUno = async (id) => {
        try {
            const data = await prisma.rol.findUnique({ where: { id: parseInt(id) } });
            if (!data || !data.estado) return { message: 'Rol no encontrado', status: 404, data: null };
            return { message: 'Rol encontrado', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    crear = async (body) => {
        try {
            const data = await prisma.rol.create({ data: body });
            return { message: 'Rol creado', status: 201, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    actualizar = async (id, body) => {
        try {
            const data = await prisma.rol.update({ where: { id: parseInt(id) }, data: body });
            return { message: 'Rol actualizado', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    eliminar = async (id) => {
        try {
            const data = await prisma.rol.update({ where: { id: parseInt(id) }, data: { estado: false } });
            return { message: 'Rol eliminado', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };
}

export const rolesService = new RolesService();