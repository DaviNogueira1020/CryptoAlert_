const { z } = require("zod");

const createAlertSchema = z.object({
  crypto: z.string().min(1),
  baseCurrency: z.string().optional(),
  targetPrice: z.number(),
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

const updateAlertSchema = createAlertSchema.partial();

module.exports = {
  createAlertSchema,
  updateAlertSchema,
};
