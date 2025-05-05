/*
  Warnings:

  - Added the required column `order` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "order" INTEGER NOT NULL;
