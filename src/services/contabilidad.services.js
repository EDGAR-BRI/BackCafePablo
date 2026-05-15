import prisma from '../config/prisma.config.js';

export class ContabilidadService {
    constructor() {}

    async obtenerCuentas() {
        try {
            const data = await prisma.cuentaContable.findMany({
                orderBy: { codigo: 'asc' }
            });
            return { message: 'Cuentas contables listadas', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    }

    async crearCuenta(body) {
        try {
            const { codigo, nombre, tipo, naturaleza } = body;
            const data = await prisma.cuentaContable.create({
                data: { codigo, nombre, tipo, naturaleza }
            });
            return { message: 'Cuenta contable creada', status: 201, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    }

    async obtenerAsientos() {
        try {
            const data = await prisma.asiento.findMany({
                include: {
                    detalles: {
                        include: { cuenta: true }
                    }
                },
                orderBy: { fecha: 'desc' }
            });
            return { message: 'Asientos listados', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    }

    async obtenerAsientoPorId(id) {
        try {
            const data = await prisma.asiento.findUnique({
                where: { id: parseInt(id) },
                include: {
                    detalles: {
                        include: { cuenta: true }
                    }
                }
            });
            if (!data) return { message: 'Asiento no encontrado', status: 404, data: null };
            return { message: 'Asiento encontrado', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    }

    async crearAsiento(body) {
        try {
            const { concepto, origen, origen_id, detalles } = body;

            const data = await prisma.asiento.create({
                data: {
                    concepto,
                    origen,
                    origen_id,
                    detalles: {
                        create: detalles.map(det => ({
                            cuenta_id: det.cuenta_id,
                            debe: det.debe || 0,
                            haber: det.haber || 0
                        }))
                    }
                },
                include: {
                    detalles: { include: { cuenta: true } }
                }
            });
            return { message: 'Asiento creado', status: 201, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    }

    async obtenerCaja() {
        try {
            const data = await prisma.caja.findMany({
                orderBy: { fecha: 'desc' }
            });
            return { message: 'Movimientos de caja listados', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    }

    async registrarCaja(body) {
        try {
            const { tipo, monto, concepto, origen, origen_id } = body;

            const ultimoSaldo = await prisma.caja.findFirst({
                orderBy: { fecha: 'desc' },
                select: { saldo: true }
            });

            const saldoAnterior = ultimoSaldo?.saldo || 0;
            const saldo = tipo === 'ingreso' ? saldoAnterior + monto : saldoAnterior - monto;

            const data = await prisma.caja.create({
                data: {
                    tipo,
                    monto,
                    concepto,
                    saldo,
                    origen,
                    origen_id
                }
            });
            return { message: 'Movimiento de caja registrado', status: 201, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    }

    async obtenerReporteVentas(fechaInicio, fechaFin) {
        try {
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            fin.setHours(23, 59, 59, 999);

            const asientos = await prisma.asiento.findMany({
                where: {
                    origen: 'orden_pago',
                    fecha: { gte: inicio, lte: fin }
                },
                include: {
                    detalles: {
                        include: { cuenta: true }
                    }
                }
            });

            let totalVentas = 0;
            let totalCostos = 0;
            let totalIva = 0;

            for (const asiento of asientos) {
                for (const det of asiento.detalles) {
                    if (det.cuenta.codigo === '4.01.01') {
                        totalVentas += det.haber;
                    }
                    if (det.cuenta.codigo === '5.01.01') {
                        totalCostos += det.debe;
                    }
                    if (det.cuenta.codigo === '2.01.01') {
                        totalIva += det.haber;
                    }
                }
            }

            const data = {
                periodo: { fechaInicio, fechaFin },
                totalVentas,
                totalCostos,
                totalIva,
                utilidadBruta: totalVentas - totalCostos
            };

            return { message: 'Reporte de ventas', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    }

    async generarAsientoPagoOrden(orden) {
        try {
            const { id, total } = orden;
            const subtotal = total / 1.16;
            const iva = total - subtotal;
            const costo = subtotal * 0.7;

            const cuentaCaja = await prisma.cuentaContable.findUnique({ where: { codigo: '1.01.01' } });
            const cuentaVentas = await prisma.cuentaContable.findUnique({ where: { codigo: '4.01.01' } });
            const cuentaIva = await prisma.cuentaContable.findUnique({ where: { codigo: '2.01.01' } });
            const cuentaCostoVenta = await prisma.cuentaContable.findUnique({ where: { codigo: '5.01.01' } });

            const asiento = await prisma.asiento.create({
                data: {
                    concepto: `Venta orden #${id}`,
                    origen: 'orden_pago',
                    origen_id: String(id),
                    detalles: {
                        create: [
                            { cuenta_id: cuentaCaja.id, debe: total },
                            { cuenta_id: cuentaVentas.id, haber: subtotal },
                            { cuenta_id: cuentaIva.id, haber: iva },
                            { cuenta_id: cuentaCostoVenta.id, debe: costo, haber: 0 },
                            { cuenta_id: cuentaCostoVenta.id, debe: 0, haber: costo }
                        ]
                    }
                },
                include: { detalles: { include: { cuenta: true } } }
            });

            return asiento;
        } catch (error) {
            throw error;
        }
    }
}

export const contabilidadService = new ContabilidadService();