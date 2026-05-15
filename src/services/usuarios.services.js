import prisma from '../config/prisma.config.js';

// Reutilizamos el 'select' en varias consultas para no repetir código
const selectUsuario = {
  id: true,
  nombre: true,
  email: true,
  rol_id: true,
  estado: true,
  rol: true,
  ordenes: true
};

export class UsuariosService {
  constructor() { }

  obtenerTodos = async () => {
    try {
      const data = await prisma.usuario.findMany({ 
        where: { estado: true },
        select: selectUsuario
      });
      return { message: 'Usuarios listados', status: 200, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };

  obtenerUno = async (id) => {
    try {
      const data = await prisma.usuario.findUnique({ 
        where: { id: parseInt(id) },
        select: selectUsuario
      });
      if (!data || !data.estado) return { message: 'No encontrado', status: 404, data: null };
      return { message: 'Encontrado', status: 200, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };

  crear = async (body) => {
    try {
      // Validar FK
      const rolExists = await prisma.rol.findUnique({ where: { id: parseInt(body.rol_id) } });
      if (!rolExists) return { message: 'El rol no existe', status: 400, data: null };

      const data = await prisma.usuario.create({ 
        data: body,
        select: selectUsuario
      });
      return { message: 'Usuario creado', status: 201, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };

  actualizar = async (id, body) => {
    try {
      if (body.rol_id) {
        const rolExists = await prisma.rol.findUnique({ where: { id: parseInt(body.rol_id) } });
        if (!rolExists) return { message: 'El rol no existe', status: 400, data: null };
      }

      const data = await prisma.usuario.update({ 
        where: { id: parseInt(id) }, 
        data: body,
        select: selectUsuario
      });
      return { message: 'Usuario actualizado', status: 200, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };

  eliminar = async (id) => {
    try {
      const data = await prisma.usuario.update({ 
        where: { id: parseInt(id) }, 
        data: { estado: false },
        select: selectUsuario
      });
      return { message: 'Usuario eliminado', status: 200, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };
}

export const usuariosService = new UsuariosService();