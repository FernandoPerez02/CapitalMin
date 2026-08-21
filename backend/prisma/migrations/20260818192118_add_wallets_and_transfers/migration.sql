-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('CHECKING', 'SAVINGS', 'CASH', 'DIGITAL', 'INVESTMENT');

-- AlterEnum
ALTER TYPE "MovementType" ADD VALUE 'Transferencia';

-- AlterTable
ALTER TABLE "movements" ADD COLUMN     "transferPairId" TEXT,
ADD COLUMN     "walletId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WalletType" NOT NULL DEFAULT 'CHECKING',
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "initialBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_accountId_name_key" ON "wallets"("accountId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "movements_transferPairId_key" ON "movements"("transferPairId");

-- CreateIndex
CREATE INDEX "movements_walletId_date_idx" ON "movements"("walletId", "date");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movements" ADD CONSTRAINT "movements_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movements" ADD CONSTRAINT "movements_transferPairId_fkey" FOREIGN KEY ("transferPairId") REFERENCES "movements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
