/*
  Warnings:

  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(8,2)`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `price` DECIMAL(8, 2) NOT NULL;
