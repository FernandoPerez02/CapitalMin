-- DropIndex
DROP INDEX "categories_accountId_name_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "categories_accountId_parentId_idx" ON "categories"("accountId", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_accountId_parentId_name_key" ON "categories"("accountId", "parentId", "name");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
