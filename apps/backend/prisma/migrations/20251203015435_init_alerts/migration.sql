-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Alert" (
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
    "initialPrice" REAL,
    "lastTriggeredAt" DATETIME,
    "title" TEXT,
    "notes" TEXT,
    "cooldown" INTEGER,
    "cooldownMinutes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "crypto" TEXT NOT NULL,
    "target" REAL NOT NULL,
    "direction" TEXT NOT NULL,
    "title" TEXT,
    "message" TEXT,
    "type" TEXT NOT NULL DEFAULT 'alert',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_crypto_idx" ON "Alert"("crypto");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_crypto_idx" ON "Notification"("crypto");
