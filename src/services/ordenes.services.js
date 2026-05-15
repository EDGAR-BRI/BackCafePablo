import prisma from '../config/prisma.config.js';
import { contabilidadService } from './contabilidad.services.js';

export class OrdenesService {
    constructor() {}

    obtenerTodos = async () => {
        try {
            const data = await prisma.orden.findMany({
                where: { estado: 'pendiente' },
                include: {
                    mesa: true,
                    usuario: { select: { nombre: true } },
                    detalles: { include: { producto: true } }
                }
            });
            return { message: 'Ordenes pendientes listadas', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    crear = async (body) => {
        try {
            const { mesa_id, usuario_id, notas, detalles } = body;
            
            // Calcular el total a partir de los detalles
            const total = detalles.reduce((acc, det) => acc + (det.precio * det.cantidad), 0);

            const data = await prisma.orden.create({
                data: {
                    mesa_id,
                    usuario_id,
                    notas,
                    total,
                    detalles: {
                        create: detalles.map(det => ({
                            producto_id: det.producto_id,
                            cantidad: det.cantidad,
                            precio: det.precio,
                            notas: det.notas
                        }))
                    }
                },
                include: { detalles: true }
            });

            return { message: 'Orden creada exitosamente', status: 201, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    pagar = async (id, body) => {
        try {
            const { metodo, monto_entregado, total, cambio, split_id, referencia, pagos } = body;

            let ordenActualizada;
            let pagosCreados;

            if (pagos && Array.isArray(pagos)) {
                const splitIdGenerado = `split_${id}_${Date.now()}`;

                const resultado = await prisma.$transaction(async (tx) => {
                    ordenActualizada = await tx.orden.update({
                        where: { id: parseInt(id) },
                        data: { estado: 'pagado' }
                    });

                    pagosCreados = await tx.pago.createMany({
                        data: pagos.map(p => ({
                            orden_id: parseInt(id),
                            metodo: p.metodo,
                            monto_entregado: p.monto,
                            total: p.metodo === 'efectivo' ? p.monto : total,
                            cambio: 0,
                            split_id: splitIdGenerado,
                            referencia: p.referencia || null
                        }))
                    });

                    return { orden: ordenActualizada, pagos: pagosCreados };
                });

                for (const p of pagos) {
                    await contabilidadService.registrarCaja({
                        tipo: 'ingreso',
                        monto: p.monto,
                        concepto: `Pago orden #${id} - ${p.metodo}`,
                        origen: 'orden_pago',
                        origen_id: String(id)
                    });
                }

                const asiento = await contabilidadService.generarAsientoPagoOrden(ordenActualizada);
                console.log('Asiento contable generado:', asiento.id);

            } else {
                const resultado = await prisma.$transaction([
                    prisma.orden.update({
                        where: { id: parseInt(id) },
                        data: { estado: 'pagado' }
                    }),
                    prisma.pago.create({
                        data: {
                            orden_id: parseInt(id),
                            metodo,
                            monto_entregado,
                            total,
                            cambio,
                            split_id,
                            referencia
                        }
                    })
                ]);

                ordenActualizada = resultado[0];
                pagosCreados = resultado[1];

                await contabilidadService.registrarCaja({
                    tipo: 'ingreso',
                    monto: total,
                    concepto: `Pago orden #${id} - ${metodo}`,
                    origen: 'orden_pago',
                    origen_id: String(id)
                });

                await contabilidadService.generarAsientoPagoOrden(ordenActualizada);
            }

            return { message: 'Pago procesado', status: 200, data: { orden: ordenActualizada, pagos: pagosCreados } };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };

    eliminar = async (id) => {
        try {
            const data = await prisma.orden.update({ where: { id: parseInt(id) }, data: { estado: 'cancelada' } });
            return { message: 'Orden cancelada', status: 200, data };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };
}

export const ordenesService = new OrdenesService();
