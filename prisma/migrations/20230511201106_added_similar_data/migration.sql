-- CreateTable
CREATE TABLE "SimilarData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wordOfTheDayId" TEXT NOT NULL,
    "signId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "movie" TEXT NOT NULL,
    "movie_image" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SimilarData_wordOfTheDayId_fkey" FOREIGN KEY ("wordOfTheDayId") REFERENCES "wordOfTheDay" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
