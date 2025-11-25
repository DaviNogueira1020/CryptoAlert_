-- Migration: add_cooldown_minutes
BEGIN TRANSACTION;

ALTER TABLE "Alert" ADD COLUMN "cooldownMinutes" INTEGER NOT NULL DEFAULT 3;

COMMIT;
