/*
  Warnings:

  - A unique constraint covering the columns `[customer,customField]` on the table `CustomerCustomField` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CustomerCustomField_customer_customField_key` ON `CustomerCustomField`(`customer`, `customField`);
