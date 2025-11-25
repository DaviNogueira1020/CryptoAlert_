-- Migration: add_alert_fields_and_notifications
BEGIN TRANSACTION;

-- Add new columns to Alert
ALTER TABLE "Alert" ADD COLUMN "isFavorite" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Alert" ADD COLUMN "notifyOnce" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Alert" ADD COLUMN "initialPrice" REAL;
ALTER TABLE "Alert" ADD COLUMN "lastTriggeredAt" DATETIME;
ALTER TABLE "Alert" ADD COLUMN "title" TEXT;
ALTER TABLE "Alert" ADD COLUMN "notes" TEXT;
ALTER TABLE "Alert" ADD COLUMN "cooldown" INTEGER;

-- Create Notification table
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

CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_crypto_idx" ON "Notification"("crypto");

COMMIT;
