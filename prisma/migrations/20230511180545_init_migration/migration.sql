/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "wordOfTheDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "signId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "movie" TEXT NOT NULL,
    "movie_image" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
