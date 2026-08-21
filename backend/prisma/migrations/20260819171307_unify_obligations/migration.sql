-- CreateEnum
CREATE TYPE "ObligationStatus" AS ENUM ('PENDIENTE', 'PAGADA');

-- DropForeignKey
ALTER TABLE "fixed_expenses" DROP CONSTRAINT "fixed_expenses_accountId_fkey";

-- DropForeignKey
ALTER TABLE "upcoming_payments" DROP CONSTRAINT "upcoming_payments_accountId_fkey";

-- DropTable
DROP TABLE "fixed_expenses";

-- DropTable
DROP TABLE "upcoming_payments";

-- CreateTable
CREATE TABLE "obligations" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "typeMovement" "MovementType" NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "recurrenceDayOfMonth" INTEGER,
    "status" "ObligationStatus" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obligations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obligation_payments" (
    "id" TEXT NOT NULL,
    "obligationId" TEXT NOT NULL,
    "movementId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obligation_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "obligations_accountId_dueDate_idx" ON "obligations"("accountId", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "obligation_payments_movementId_key" ON "obligation_payments"("movementId");

-- CreateIndex
CREATE INDEX "obligation_payments_obligationId_idx" ON "obligation_payments"("obligationId");

-- AddForeignKey
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligation_payments" ADD CONSTRAINT "obligation_payments_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "obligations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligation_payments" ADD CONSTRAINT "obligation_payments_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
