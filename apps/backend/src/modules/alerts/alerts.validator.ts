export {};
import { z } from "zod";

const createAlertBase = z.object({
  // Accept both legacy keys (coin, price) and new keys (crypto, targetPrice)
  crypto: z.string().min(1).optional(),
  coin: z.string().min(1).optional(),
  baseCurrency: z.string().optional(),
  targetPrice: z.number().optional(),
  price: z.number().optional(),
  direction: z.enum(["above", "below"]),

  isActive: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  notifyOnce: z.boolean().optional(),

  initialPrice: z.number().optional(),
  lastTriggeredAt: z.string().optional(),

  title: z.string().optional(),
  notes: z.string().optional(),

  cooldown: z.number().optional(),
  cooldownMinutes: z.number().optional(),
});

export const createAlertSchema = createAlertBase.refine((d) => (d.crypto || d.coin) && (d.targetPrice !== undefined || d.price !== undefined), {
  message: "É necessário informar coin/crypto e price/targetPrice",
});

export const updateAlertSchema = createAlertBase.partial();

// Lista: query params para paginação e include
export const listAlertsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  includeUser: z.string().optional(),
});

export const idParamSchema = z.object({ id: z.coerce.number().int().positive() });

