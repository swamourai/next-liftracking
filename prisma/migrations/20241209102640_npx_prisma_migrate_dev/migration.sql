/*
  Warnings:

  - Changed the type of `userId` on the `Lift` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Lift" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;
