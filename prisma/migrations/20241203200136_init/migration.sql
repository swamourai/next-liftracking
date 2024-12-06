/*
  Warnings:

  - Added the required column `serie` to the `Lift` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lift" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rpe" INTEGER NOT NULL,
    "rep" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "serie" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lift" ("date", "id", "rep", "rpe", "type", "userId", "weight") SELECT "date", "id", "rep", "rpe", "type", "userId", "weight" FROM "Lift";
DROP TABLE "Lift";
ALTER TABLE "new_Lift" RENAME TO "Lift";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
