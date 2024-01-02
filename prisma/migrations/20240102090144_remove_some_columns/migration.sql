/*
  Warnings:

  - You are about to drop the column `solved` on the `wordOfTheDay` table. All the data in the column will be lost.
  - You are about to drop the column `solvedBy` on the `wordOfTheDay` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_wordOfTheDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "signId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "movie" TEXT NOT NULL,
    "movie_image" TEXT NOT NULL,
    "dateCreated" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_wordOfTheDay" ("createdAt", "dateCreated", "description", "id", "movie", "movie_image", "signId", "updatedAt", "word") SELECT "createdAt", "dateCreated", "description", "id", "movie", "movie_image", "signId", "updatedAt", "word" FROM "wordOfTheDay";
DROP TABLE "wordOfTheDay";
ALTER TABLE "new_wordOfTheDay" RENAME TO "wordOfTheDay";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
