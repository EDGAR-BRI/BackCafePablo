import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seed...');

  // Hash passwords helper
  const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  // 1. Crear Roles
  const rolesData = ['Administrador', 'Mesero', 'Cajero', 'Cocinero', 'Gerente'];
  const roles = {};
  for (const nombre of rolesData) {
    const rol = await prisma.rol.upsert({
      where: { nombre },
      update: {},
      create: { nombre, estado: true }
    });
    roles[nombre] = rol;
  }
  console.log('✅ Roles creados');

  // 2. Crear Categorías
  const categoriasData = [
    { nombre: 'Cafés', descripcion: 'Bebidas de café' },
    { nombre: 'Bebidas Frías', descripcion: 'Jugos, refrescos, batidos' },
    { nombre: 'Entradas', descripcion: 'Aperitivos y entradas' },
    { nombre: 'Sandwiches', descripcion: 'Sandwiches y wraps' },
    { nombre: 'Postres', descripcion: 'Dulces y repostería' },
    { nombre: 'Combos', descripcion: 'Paquetes combinados' }
  ];
  const categorias = {};
  for (const cat of categoriasData) {
    const c = await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: {},
      create: { nombre: cat.nombre, estado: true }
    });
    categorias[cat.nombre] = c;
  }
  console.log('✅ Categorías creadas');

  // 3. Crear Mesas
  const mesasData = [
    { nombre: 'Mesa 1 (Interior)', capacidad: 4 },
    { nombre: 'Mesa 2 (Interior)', capacidad: 4 },
    { nombre: 'Mesa 3 (Interior)', capacidad: 6 },
    { nombre: 'Mesa 4 (Terraza)', capacidad: 4 },
    { nombre: 'Mesa 5 (Terraza)', capacidad: 2 },
    { nombre: 'Mesa 6 (Bar)', capacidad: 2 },
    { nombre: 'Mesa 7 (VIP)', capacidad: 8 },
  ];
  const mesas = [];
  for (const mesa of mesasData) {
    const m = await prisma.mesa.upsert({
      where: { nombre: mesa.nombre },
      update: {},
      create: { nombre: mesa.nombre, capacidad: mesa.capacidad, estado: true }
    });
    mesas.push(m);
  }
  console.log('✅ Mesas creadas');

  // 4. Crear Usuarios (con passwords hasheados)
  const usuariosData = [
    { nombre: 'Carlos Admin', email: 'admin@cafe.com', password: 'admin123', rol: 'Administrador' },
    { nombre: 'Pedro Mesero', email: 'pedro@cafe.com', password: 'mesero123', rol: 'Mesero' },
    { nombre: 'María Cajera', email: 'maria@cafe.com', password: 'cajero123', rol: 'Cajero' },
    { nombre: 'Juan Cocinero', email: 'juan@cafe.com', password: 'cocinero123', rol: 'Cocinero' },
    { nombre: 'Laura Gerente', email: 'laura@cafe.com', password: 'gerente123', rol: 'Gerente' },
    // Usuarios Pablo
    { nombre: 'Pablo Admin', email: 'admin.pablo36115@gmail.com', password: '123456', rol: 'Administrador' },
    { nombre: 'Pablo Mesero', email: 'mesero.pablo36115@gmail.com', password: '123456', rol: 'Mesero' },
    { nombre: 'Pablo Cajero', email: 'cajero.pablo36115@gmail.com', password: '123456', rol: 'Cajero' },
    { nombre: 'Pablo Cocinero', email: 'cocinero.pablo36115@gmail.com', password: '123456', rol: 'Cocinero' },
    { nombre: 'Pablo Gerente', email: 'gerente.pablo36115@gmail.com', password: '123456', rol: 'Gerente' },
  ];
  const usuarios = {};
  for (const u of usuariosData) {
    const hashedPassword = await hashPassword(u.password);
    const usuario = await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: {
        nombre: u.nombre,
        email: u.email,
        password: hashedPassword,
        rol_id: roles[u.rol].id
      }
    });
    usuarios[u.rol] = usuario;
  }
  console.log('✅ Usuarios creados');

  // 5. Crear Productos
  const productosData = [
    // Cafés
    { nombre: 'Espresso', precio: 2.00, cantidad: 100, categoria: 'Cafés' },
    { nombre: 'Café Americano', precio: 2.50, cantidad: 80, categoria: 'Cafés' },
    { nombre: 'Café Latte', precio: 3.50, cantidad: 60, categoria: 'Cafés' },
    { nombre: 'Cappuccino', precio: 3.50, cantidad: 50, categoria: 'Cafés' },
    { nombre: 'Moccaccino', precio: 4.00, cantidad: 40, categoria: 'Cafés' },
    { nombre: 'Frappé de Café', precio: 4.50, cantidad: 30, categoria: 'Cafés' },
    // Bebidas Frías
    { nombre: 'Jugo de Naranja', precio: 3.00, cantidad: 40, categoria: 'Bebidas Frías' },
    { nombre: 'Batido de Fresa', precio: 4.00, cantidad: 30, categoria: 'Bebidas Frías' },
    { nombre: 'Limonada', precio: 2.50, cantidad: 50, categoria: 'Bebidas Frías' },
    { nombre: 'Coca-Cola', precio: 2.00, cantidad: 60, categoria: 'Bebidas Frías' },
    { nombre: 'Agua Mineral', precio: 1.50, cantidad: 80, categoria: 'Bebidas Frías' },
    // Entradas
    { nombre: 'Tequeños (6u)', precio: 5.00, cantidad: 25, categoria: 'Entradas' },
    { nombre: 'Nachos con Queso', precio: 6.00, cantidad: 20, categoria: 'Entradas' },
    { nombre: 'Alitas BBQ (10u)', precio: 8.00, cantidad: 15, categoria: 'Entradas' },
    { nombre: 'Pan con Ajo', precio: 3.00, cantidad: 30, categoria: 'Entradas' },
    // Sandwiches
    { nombre: 'Club Sandwich', precio: 8.50, cantidad: 20, categoria: 'Sandwiches' },
    { nombre: 'Sandwich de Jamón', precio: 6.00, cantidad: 25, categoria: 'Sandwiches' },
    { nombre: 'Wrap de Pollo', precio: 7.50, cantidad: 15, categoria: 'Sandwiches' },
    { nombre: 'Baguette Italiano', precio: 7.00, cantidad: 15, categoria: 'Sandwiches' },
    // Postres
    { nombre: 'Pastel de Chocolate', precio: 4.50, cantidad: 12, categoria: 'Postres' },
    { nombre: 'Cheesecake', precio: 5.00, cantidad: 10, categoria: 'Postres' },
    { nombre: 'Tiramisú', precio: 5.50, cantidad: 8, categoria: 'Postres' },
    { nombre: 'Brownie con Helado', precio: 5.00, cantidad: 15, categoria: 'Postres' },
    { nombre: 'Galletas caseras (4u)', precio: 3.00, cantidad: 20, categoria: 'Postres' },
    // Combos
    { nombre: 'Combo Desayuno', precio: 9.00, cantidad: 15, categoria: 'Combos' },
    { nombre: 'Combo Almuerzo', precio: 12.00, cantidad: 20, categoria: 'Combos' },
    { nombre: 'Combo Café + Pastel', precio: 6.00, cantidad: 25, categoria: 'Combos' },
  ];

  const productos = [];
  for (const prod of productosData) {
    const p = await prisma.producto.create({
      data: {
        nombre: prod.nombre,
        precio: prod.precio,
        cantidad: prod.cantidad,
        categoria_id: categorias[prod.categoria].id,
        estado: true
      }
    });
    productos.push(p);
  }
  console.log('✅ Productos creados');

  // 6. Crear Órdenes de ejemplo
  const ordenesData = [
    {
      mesa: 'Mesa 1 (Interior)',
      usuario: 'Pablo Mesero',
      estado: 'pendiente',
      total: 24.50,
      notas: 'Café sin azúcar',
      detalles: [
        { producto: 'Café Latte', cantidad: 2, precio: 3.50 },
        { producto: 'Tequeños (6u)', cantidad: 2, precio: 2.50 },
        { producto: 'Pastel de Chocolate', cantidad: 1, precio: 4.50 },
      ]
    },
    {
      mesa: 'Mesa 3 (Interior)',
      usuario: 'Pablo Mesero',
      estado: 'pendiente',
      total: 45.00,
      notas: 'Sin cebolla en sandwich',
      detalles: [
        { producto: 'Club Sandwich', cantidad: 2, precio: 8.50 },
        { producto: 'Limonada', cantidad: 2, precio: 2.50 },
        { producto: 'Nachos con Queso', cantidad: 1, precio: 6.00 },
        { producto: 'Batido de Fresa', cantidad: 2, precio: 4.00 },
      ]
    },
    {
      mesa: 'Mesa 4 (Terraza)',
      usuario: 'Pablo Mesero',
      estado: 'pagada',
      total: 18.00,
      notas: '',
      detalles: [
        { producto: 'Frappé de Café', cantidad: 2, precio: 4.50 },
        { producto: 'Tequeños (6u)', cantidad: 1, precio: 5.00 },
        { producto: 'Tiramisú', cantidad: 1, precio: 5.50 },
      ]
    },
    {
      mesa: 'Mesa 5 (Terraza)',
      usuario: 'Pablo Mesero',
      estado: 'pendiente',
      total: 12.00,
      notas: 'Combo para llevar',
      detalles: [
        { producto: 'Combo Café + Pastel', cantidad: 2, precio: 6.00 },
      ]
    }
  ];

  // Helper function to create accounting entry for a paid order
  const createAccountingEntryForOrder = async (orden, totalAmount) => {
    // Create Asiento
    const asiento = await prisma.asiento.create({
      data: {
        fecha: orden.creado_en || new Date(),
        concepto: `Venta orden #${orden.id}`,
        origen: 'orden_pago',
        origen_id: orden.id.toString()
      }
    });

    // Find revenue accounts (we'll use the first income account for simplicity)
    const ingresosCuenta = await prisma.cuentaContable.findFirst({
      where: { tipo: 'I' } // Ingreso
    });

    // Find cash account
    const cajaCuenta = await prisma.cuentaContable.findFirst({
      where: { codigo: '1.01.01' } // Caja
    });

    if (ingresosCuenta && cajaCuenta) {
      // Create DetalleAsiento for ingresos (haber)
      await prisma.detalleAsiento.create({
        data: {
          asiento_id: asiento.id,
          cuenta_id: ingresosCuenta.id,
          debe: 0,
          haber: totalAmount
        }
      });

      // Create DetalleAsiento for caja (debe)
      await prisma.detalleAsiento.create({
        data: {
          asiento_id: asiento.id,
          cuenta_id: cajaCuenta.id,
          debe: totalAmount,
          haber: 0
        }
      });
    }

    return asiento;
  };

  // Process orders
  for (const o of ordenesData) {
    const mesaObj = mesas.find(m => m.nombre === o.mesa);
    const usuarioObj = Object.values(usuarios).find(u => u.nombre === o.usuario);
    
    const detalles = o.detalles.map(d => {
      const prod = productos.find(p => p.nombre === d.producto);
      return {
        producto_id: prod.id,
        cantidad: d.cantidad,
        precio: d.precio
      };
    });

    const orden = await prisma.orden.create({
      data: {
        mesa_id: mesaObj.id,
        usuario_id: usuarioObj.id,
        estado: o.estado,
        total: o.total,
        notas: o.notas || null,
        detalles: {
          create: detalles
        }
      }
    });

    // If order is paid, create payment and accounting entry
    if (o.estado === 'pagada') {
      // Create Pago record
      await prisma.pago.create({
        data: {
          orden_id: orden.id,
          metodo: 'efectivo', // Default method
          monto_entregado: o.total, // Assuming exact payment
          total: o.total,
          cambio: 0
        }
      });

      // Create accounting entry
      await createAccountingEntryForOrder(orden, o.total);
      
      console.log(`✅ Pago y asiento contable creado para orden #${orden.id}`);
    }
  }
  console.log('✅ Órdenes de prueba creadas');

  // 7. Crear Plan de Cuentas Contables
  const cuentasBase = [
    // ACTIVOS
    { codigo: '1.01.01', nombre: 'Caja', tipo: 'A', naturaleza: 'deudora' },
    { codigo: '1.01.02', nombre: 'Banco', tipo: 'A', naturaleza: 'deudora' },
    { codigo: '1.02.01', nombre: 'Cuentas por Cobrar', tipo: 'A', naturaleza: 'deudora' },
    { codigo: '1.03.01', nombre: 'Inventario', tipo: 'A', naturaleza: 'deudora' },
    // PASIVOS
    { codigo: '2.01.01', nombre: 'IVA por Pagar', tipo: 'P', naturaleza: 'acredora' },
    { codigo: '2.02.01', nombre: 'Proveedores', tipo: 'P', naturaleza: 'acredora' },
    { codigo: '2.03.01', nombre: 'Sueldos por Pagar', tipo: 'P', naturaleza: 'acredora' },
    // PATRIMONIO
    { codigo: '3.01.01', nombre: 'Capital Social', tipo: 'Pat', naturaleza: 'acredora' },
    { codigo: '3.02.01', nombre: 'Utilidades Acumuladas', tipo: 'Pat', naturaleza: 'acredora' },
    // INGRESOS
    { codigo: '4.01.01', nombre: 'Ventas de Café', tipo: 'I', naturaleza: 'acredora' },
    { codigo: '4.01.02', nombre: 'Ventas de Comida', tipo: 'I', naturaleza: 'acredora' },
    { codigo: '4.02.01', nombre: 'Otros Ingresos', tipo: 'I', naturaleza: 'acredora' },
    // COSTOS
    { codigo: '5.01.01', nombre: 'Costo de Bebidas', tipo: 'C', naturaleza: 'deudora' },
    { codigo: '5.01.02', nombre: 'Costo de Comida', tipo: 'C', naturaleza: 'deudora' },
    // GASTOS
    { codigo: '6.01.01', nombre: 'Gastos de Personal', tipo: 'G', naturaleza: 'deudora' },
    { codigo: '6.01.02', nombre: 'Gastos de Operación', tipo: 'G', naturaleza: 'deudora' },
    { codigo: '6.01.03', nombre: 'Gastos de Servicios', tipo: 'G', naturaleza: 'deudora' },
    { codigo: '6.01.04', nombre: 'Gastos de Alquiler', tipo: 'G', naturaleza: 'deudora' },
  ];

  for (const cuenta of cuentasBase) {
    await prisma.cuentaContable.upsert({
      where: { codigo: cuenta.codigo },
      update: {},
      create: cuenta
    });
  }
  console.log('✅ Plan de Cuentas Contables creado');

  // 8. Crear movimientos de caja de ejemplo
  const cajaData = [
    { tipo: 'ingreso', monto: 100.00, concepto: 'Apertura de caja', origen: 'apertura' },
    { tipo: 'ingreso', monto: 45.50, concepto: 'Venta Mesa 4', origen: 'orden_pago' },
    { tipo: 'egreso', monto: 15.00, concepto: 'Compra de insumos', origen: 'gasto' },
  ];

  let saldoAcumulado = 0;
  for (const c of cajaData) {
    saldoAcumulado += c.tipo === 'ingreso' ? c.monto : -c.monto;
    await prisma.caja.create({
      data: {
        tipo: c.tipo,
        monto: c.monto,
        concepto: c.concepto,
        saldo: saldoAcumulado,
        origen: c.origen
      }
    });
  }
  console.log('✅ Movimientos de caja creados');

  console.log('¡Seed ejecutado con éxito! 🚀');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });