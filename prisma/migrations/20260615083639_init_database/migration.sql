-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'GUIDE', 'LEAD_GUIDE', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT 'default.jpg',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "maxGroupSize" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "ratingsAverage" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "ratingsQuantity" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "priceDiscount" DOUBLE PRECISION,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "imageCover" TEXT NOT NULL,
    "images" TEXT[],
    "startDates" TIMESTAMP(3)[],
    "secretTour" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" INTEGER NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_name_key" ON "Tour"("name");

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
