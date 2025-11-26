export {};
import { z } from "zod";
export declare const createAlertSchema: z.ZodEffects<z.ZodObject<{
    crypto: z.ZodOptional<z.ZodString>;
    coin: z.ZodOptional<z.ZodString>;
    baseCurrency: z.ZodOptional<z.ZodString>;
    targetPrice: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    direction: z.ZodEnum<["above", "below"]>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    isFavorite: z.ZodOptional<z.ZodBoolean>;
    notifyOnce: z.ZodOptional<z.ZodBoolean>;
    initialPrice: z.ZodOptional<z.ZodNumber>;
    lastTriggeredAt: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    cooldown: z.ZodOptional<z.ZodNumber>;
    cooldownMinutes: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    direction: "above" | "below";
    coin?: string | undefined;
    price?: number | undefined;
    crypto?: string | undefined;
    baseCurrency?: string | undefined;
    isFavorite?: boolean | undefined;
    notifyOnce?: boolean | undefined;
    cooldown?: number | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    targetPrice?: number | undefined;
    isActive?: boolean | undefined;
    initialPrice?: number | undefined;
    lastTriggeredAt?: string | undefined;
    cooldownMinutes?: number | undefined;
}, {
    direction: "above" | "below";
    coin?: string | undefined;
    price?: number | undefined;
    crypto?: string | undefined;
    baseCurrency?: string | undefined;
    isFavorite?: boolean | undefined;
    notifyOnce?: boolean | undefined;
    cooldown?: number | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    targetPrice?: number | undefined;
    isActive?: boolean | undefined;
    initialPrice?: number | undefined;
    lastTriggeredAt?: string | undefined;
    cooldownMinutes?: number | undefined;
}>, {
    direction: "above" | "below";
    coin?: string | undefined;
    price?: number | undefined;
    crypto?: string | undefined;
    baseCurrency?: string | undefined;
    isFavorite?: boolean | undefined;
    notifyOnce?: boolean | undefined;
    cooldown?: number | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    targetPrice?: number | undefined;
    isActive?: boolean | undefined;
    initialPrice?: number | undefined;
    lastTriggeredAt?: string | undefined;
    cooldownMinutes?: number | undefined;
}, {
    direction: "above" | "below";
    coin?: string | undefined;
    price?: number | undefined;
    crypto?: string | undefined;
    baseCurrency?: string | undefined;
    isFavorite?: boolean | undefined;
    notifyOnce?: boolean | undefined;
    cooldown?: number | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    targetPrice?: number | undefined;
    isActive?: boolean | undefined;
    initialPrice?: number | undefined;
    lastTriggeredAt?: string | undefined;
    cooldownMinutes?: number | undefined;
}>;
export declare const updateAlertSchema: z.ZodObject<{
    crypto: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    coin: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    baseCurrency: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    targetPrice: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    price: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    direction: z.ZodOptional<z.ZodEnum<["above", "below"]>>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    isFavorite: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    notifyOnce: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    initialPrice: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    lastTriggeredAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    cooldown: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    cooldownMinutes: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    coin?: string | undefined;
    price?: number | undefined;
    crypto?: string | undefined;
    direction?: "above" | "below" | undefined;
    baseCurrency?: string | undefined;
    isFavorite?: boolean | undefined;
    notifyOnce?: boolean | undefined;
    cooldown?: number | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    targetPrice?: number | undefined;
    isActive?: boolean | undefined;
    initialPrice?: number | undefined;
    lastTriggeredAt?: string | undefined;
    cooldownMinutes?: number | undefined;
}, {
    coin?: string | undefined;
    price?: number | undefined;
    crypto?: string | undefined;
    direction?: "above" | "below" | undefined;
    baseCurrency?: string | undefined;
    isFavorite?: boolean | undefined;
    notifyOnce?: boolean | undefined;
    cooldown?: number | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    targetPrice?: number | undefined;
    isActive?: boolean | undefined;
    initialPrice?: number | undefined;
    lastTriggeredAt?: string | undefined;
    cooldownMinutes?: number | undefined;
}>;
export declare const listAlertsQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    includeUser: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    page?: number | undefined;
    includeUser?: string | undefined;
}, {
    limit?: number | undefined;
    page?: number | undefined;
    includeUser?: string | undefined;
}>;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
//# sourceMappingURL=alerts.validator.d.ts.map