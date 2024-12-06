/*
  Warnings:

  - You are about to drop the column `failurSerie` on the `Lift` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `Lift` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lift" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rpe" INTEGER NOT NULL,
    "rep" INTEGER NOT NULL,
    "serie" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    "failure" BOOLEAN,
    "failureSerie" INTEGER,
    "failureRep" INTEGER
);
INSERT INTO "new_Lift" ("comment", "date", "failure", "failureRep", "id", "rep", "rpe", "serie", "type", "userId", "weight") SELECT "comment", "date", "failure", "failureRep", "id", "rep", "rpe", "serie", "type", "userId", "weight" FROM "Lift";
DROP TABLE "Lift";
ALTER TABLE "new_Lift" RENAME TO "Lift";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
