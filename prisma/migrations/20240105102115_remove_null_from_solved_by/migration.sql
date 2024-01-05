/*
  Warnings:

  - Made the column `solvedBy` on table `GuessWord` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuessWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wordOfTheDayId" TEXT NOT NULL,
    "solvedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GuessWord_wordOfTheDayId_fkey" FOREIGN KEY ("wordOfTheDayId") REFERENCES "wordOfTheDay" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuessWord" ("createdAt", "id", "solvedBy", "updatedAt", "wordOfTheDayId") SELECT "createdAt", "id", "solvedBy", "updatedAt", "wordOfTheDayId" FROM "GuessWord";
DROP TABLE "GuessWord";
ALTER TABLE "new_GuessWord" RENAME TO "GuessWord";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
