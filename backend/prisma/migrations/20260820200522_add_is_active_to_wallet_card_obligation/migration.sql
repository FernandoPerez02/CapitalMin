-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "obligations" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
