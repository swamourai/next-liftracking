-- CreateTable
CREATE TABLE "Lift" (
    "id" SERIAL NOT NULL,
    "rpe" INTEGER NOT NULL,
    "rep" INTEGER NOT NULL,
    "serie" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    "failure" BOOLEAN,
    "failureSerie" INTEGER,
    "failureRep" INTEGER,

    CONSTRAINT "Lift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
