import prisma from '../config/prisma.config.js';

export class ProductosService {
  constructor() { }

  obtenerTodos = async () => {
    try {
      const data = await prisma.producto.findMany({ where: { estado: true }, include: { categoria: true } });
      return { message: 'Productos listados', status: 200, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };

  obtenerUno = async (id) => {
    try {
      const data = await prisma.producto.findUnique({ where: { id: parseInt(id) }, include: { categoria: true } });
      if (!data || !data.estado) return { message: 'No encontrado', status: 404, data: null };
      return { message: 'Encontrado', status: 200, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };

  crear = async (body) => {
    try {
      const catExists = await prisma.categoria.findUnique({ where: { id: parseInt(body.categoria_id) } });
      if (!catExists) return { message: 'Categoría no existe', status: 400, data: null };

      const data = await prisma.producto.create({ data: body });
      return { message: 'Producto creado', status: 201, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };

  actualizar = async (id, body) => {
    try {
      const data = await prisma.producto.update({ where: { id: parseInt(id) }, data: body });
      return { message: 'Producto actualizado', status: 200, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };

  eliminar = async (id) => {
    try {
      const data = await prisma.producto.update({ where: { id: parseInt(id) }, data: { estado: false } });
      return { message: 'Producto eliminado', status: 200, data };
    } catch (error) {
      return { message: error.message, status: 500, data: null };
    }
  };
}

export const productosService = new ProductosService();