/*
  Warnings:

  - You are about to drop the column `area_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `areas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "areas" DROP CONSTRAINT "areas_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_area_id_fkey";

-- DropIndex
DROP INDEX "products_name_area_id_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "area_id",
ALTER COLUMN "quantity" SET DEFAULT 0;

-- DropTable
DROP TABLE "areas";

-- DropTable
DROP TABLE "warehouses";

-- CreateTable
CREATE TABLE "mesas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 4,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mesas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes" (
    "id" SERIAL NOT NULL,
    "mesa_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notas" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_orden" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "notas" TEXT,

    CONSTRAINT "detalles_orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "metodo" TEXT NOT NULL,
    "monto_entregado" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "cambio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "referencia" TEXT,
    "split_id" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas_contables" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "naturaleza" TEXT NOT NULL,

    CONSTRAINT "cuentas_contables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asientos" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "concepto" TEXT NOT NULL,
    "origen" TEXT NOT NULL,
    "origen_id" TEXT,

    CONSTRAINT "asientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_asiento" (
    "id" SERIAL NOT NULL,
    "asiento_id" INTEGER NOT NULL,
    "cuenta_id" INTEGER NOT NULL,
    "debe" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "haber" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "detalles_asiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cajas" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "concepto" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "origen" TEXT NOT NULL,
    "origen_id" TEXT,

    CONSTRAINT "cajas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mesas_name_key" ON "mesas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_contables_codigo_key" ON "cuentas_contables"("codigo");

-- AddForeignKey
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_mesa_id_fkey" FOREIGN KEY ("mesa_id") REFERENCES "mesas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes" ADD CONSTRAINT "ordenes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_orden" ADD CONSTRAINT "detalles_orden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_orden" ADD CONSTRAINT "detalles_orden_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_asiento" ADD CONSTRAINT "detalles_asiento_asiento_id_fkey" FOREIGN KEY ("asiento_id") REFERENCES "asientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_asiento" ADD CONSTRAINT "detalles_asiento_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "cuentas_contables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
