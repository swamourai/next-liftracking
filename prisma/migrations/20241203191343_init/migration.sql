-- CreateTable
CREATE TABLE "Lift" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rpe" INTEGER NOT NULL,
    "rep" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
