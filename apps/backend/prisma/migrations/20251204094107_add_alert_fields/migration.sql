/*
  Warnings:

  - You are about to drop the column `notes` on the `Alert` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "crypto" TEXT NOT NULL,
    "baseCurrency" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'precoAlvo',
    "precoAlvo" REAL,
    "percentualAlta" REAL,
    "percentualQueda" REAL,
    "volumeMinimo" REAL,
    "direction" TEXT NOT NULL DEFAULT 'above',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "notifyOnce" BOOLEAN NOT NULL DEFAULT false,
    "alertDate" DATETIME,
    "alertTime" TEXT,
    "notificationType" TEXT NOT NULL DEFAULT 'system',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "repetition" TEXT NOT NULL DEFAULT 'once',
    "initialPrice" REAL,
    "lastTriggeredAt" DATETIME,
    "triggerCount" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "description" TEXT,
    "cooldown" INTEGER,
    "cooldownMinutes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Alert" ("baseCurrency", "cooldown", "cooldownMinutes", "createdAt", "crypto", "direction", "id", "initialPrice", "isActive", "isFavorite", "lastTriggeredAt", "notifyOnce", "percentualAlta", "percentualQueda", "precoAlvo", "tipo", "title", "updatedAt", "userId", "volumeMinimo") SELECT "baseCurrency", "cooldown", "cooldownMinutes", "createdAt", "crypto", "direction", "id", "initialPrice", "isActive", "isFavorite", "lastTriggeredAt", "notifyOnce", "percentualAlta", "percentualQueda", "precoAlvo", "tipo", "title", "updatedAt", "userId", "volumeMinimo" FROM "Alert";
DROP TABLE "Alert";
ALTER TABLE "new_Alert" RENAME TO "Alert";
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");
CREATE INDEX "Alert_crypto_idx" ON "Alert"("crypto");
CREATE INDEX "Alert_isActive_idx" ON "Alert"("isActive");
CREATE INDEX "Alert_priority_idx" ON "Alert"("priority");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
