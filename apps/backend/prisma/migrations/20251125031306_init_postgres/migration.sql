-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('system', 'alert', 'security', 'info');

-- CreateEnum
CREATE TYPE "AlertDirection" AS ENUM ('above', 'below');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "crypto" TEXT NOT NULL,
    "baseCurrency" TEXT,
    "targetPrice" DOUBLE PRECISION NOT NULL,
    "direction" "AlertDirection" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "notifyOnce" BOOLEAN NOT NULL DEFAULT false,
    "initialPrice" DOUBLE PRECISION,
    "lastTriggeredAt" TIMESTAMP(3),
    "title" TEXT,
    "notes" TEXT,
    "cooldown" INTEGER,
    "cooldownMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "crypto" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "direction" "AlertDirection" NOT NULL,
    "title" TEXT,
    "message" TEXT,
    "type" "NotificationType" NOT NULL DEFAULT 'alert',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
