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
    "comment" TEXT DEFAULT '',
    "failure" BOOLEAN NOT NULL DEFAULT false,
    "failurSerie" INTEGER,
    "failureRep" INTEGER,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lift" ("comment", "date", "failurSerie", "failure", "failureRep", "id", "rep", "rpe", "serie", "type", "userId", "weight") SELECT "comment", "date", "failurSerie", "failure", "failureRep", "id", "rep", "rpe", "serie", "type", "userId", "weight" FROM "Lift";
DROP TABLE "Lift";
ALTER TABLE "new_Lift" RENAME TO "Lift";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
