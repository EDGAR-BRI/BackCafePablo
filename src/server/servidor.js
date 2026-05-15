import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from '../config/prisma.config.js';

// Rutas
import authRoutes from '../routes/auth.rutas.js';
import rolesRoutes from '../routes/roles.rutas.js';
import productosRoutes from '../routes/productos.rutas.js';
import categoriasRoutes from '../routes/categorias.rutas.js';
import usuariosRoutes from '../routes/usuarios.rutas.js';
import mesasRoutes from '../routes/mesas.rutas.js';
import ordenesRoutes from '../routes/ordenes.rutas.js';
import contabilidadRoutes from '../routes/contabilidad.rutas.js';

dotenv.config();

export class Servidor {
  app;
  port;
  pre;

  constructor() {
    this.app = express();
    this.port = 3800; // Puedes usar process.env.PORT || 3800
    this.pre = '/api';

    this.midelware();

    this.rutas = {
      auth: `${this.pre}/auth`,
      roles: `${this.pre}/roles`,
      usuarios: `${this.pre}/usuarios`,
      categorias: `${this.pre}/categorias`,
      productos: `${this.pre}/productos`,
      mesas: `${this.pre}/mesas`,
      ordenes: `${this.pre}/ordenes`,
      contabilidad: `${this.pre}/contabilidad`,
    };

    this.routes();
  }

  midelware = () => {
    this.app.use(express.json());
    this.app.use(cors());
  };

  routes = () => {
    // Ruta base /api para verificar que el servidor está corriendo
    this.app.get(this.pre, (req, res) => {
      res.status(200).json({
        ok: true,
        mensaje: 'La API del Restaurante está corriendo exitosamente'
      });
    });

    this.app.use(this.rutas.auth, authRoutes);
    this.app.use(this.rutas.roles, rolesRoutes);
    this.app.use(this.rutas.productos, productosRoutes);
    this.app.use(this.rutas.categorias, categoriasRoutes);
    this.app.use(this.rutas.usuarios, usuariosRoutes);
    this.app.use(this.rutas.mesas, mesasRoutes);
    this.app.use(this.rutas.ordenes, ordenesRoutes);
    this.app.use(this.rutas.contabilidad, contabilidadRoutes);
  };

  async dbConnection() {
    try {
      // Ahora sí funcionará porque importamos 'prisma' arriba
      await prisma.$connect();
      console.log('Base de Datos Online (PostgreSQL + Prisma)');
    } catch (error) {
      console.error('Error al conectar a la Base de Datos:');
      console.error(error);
      process.exit(1);
    }
  }

  async listen() {
    await this.dbConnection();

    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}