/*
  Warnings:

  - Added the required column `gameType` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointSplit` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Unofficial',
    "gameType" TEXT NOT NULL,
    "winnerCount" INTEGER NOT NULL DEFAULT 1,
    "pointSplit" JSONB NOT NULL,
    "date" DATETIME,
    "participants" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Event" ("date", "id", "name", "participants", "type") SELECT "date", "id", "name", "participants", "type" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
