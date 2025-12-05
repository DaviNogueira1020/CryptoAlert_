"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.listAlertsQuerySchema = exports.updateAlertSchema = exports.createAlertSchema = void 0;
const zod_1 = require("zod");
exports.createAlertSchema = zod_1.z.object({
    crypto: zod_1.z.string().min(1, 'Cripto obrigatória').transform(v => v.toLowerCase()),
    tipo: zod_1.z.enum(['precoAlvo', 'altaPercentual', 'quedaPercentual', 'volume']).default('precoAlvo'),
    // Condições (validadas conforme tipo)
    precoAlvo: zod_1.z.number().positive('Preço deve ser positivo').optional(),
    percentualAlta: zod_1.z.number().positive('Percentual deve ser positivo').optional(),
    percentualQueda: zod_1.z.number().positive('Percentual deve ser positivo').optional(),
    volumeMinimo: zod_1.z.number().positive('Volume deve ser positivo').optional(),
    direction: zod_1.z.enum(['above', 'below']).default('above'),
    // Agendamento e data/hora
    alertDate: zod_1.z.string().datetime().optional(), // ISO 8601
    alertTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM obrigatório').optional(),
    // Notificação e prioridade
    notificationType: zod_1.z.enum(['email', 'sms', 'push', 'system']).default('system'),
    priority: zod_1.z.enum(['normal', 'alta', 'critica']).default('normal'),
    // Recorrência
    repetition: zod_1.z.enum(['once', 'diario', 'semanal']).default('once'),
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    baseCurrency: zod_1.z.string().optional(),
}).refine((data) => {
    if (data.tipo === 'precoAlvo' && !data.precoAlvo)
        return false;
    if (data.tipo === 'altaPercentual' && !data.percentualAlta)
        return false;
    if (data.tipo === 'quedaPercentual' && !data.percentualQueda)
        return false;
    if (data.tipo === 'volume' && !data.volumeMinimo)
        return false;
    return true;
}, {
    message: 'Condição obrigatória para o tipo de alerta selecionado',
});
exports.updateAlertSchema = zod_1.z.object({
    crypto: zod_1.z.string().min(1, 'Cripto obrigatória').transform(v => v.toLowerCase()).optional(),
    tipo: zod_1.z.enum(['precoAlvo', 'altaPercentual', 'quedaPercentual', 'volume']).optional(),
    // Condições (todas opcionais na atualização)
    precoAlvo: zod_1.z.number().positive('Preço deve ser positivo').optional(),
    percentualAlta: zod_1.z.number().positive('Percentual deve ser positivo').optional(),
    percentualQueda: zod_1.z.number().positive('Percentual deve ser positivo').optional(),
    volumeMinimo: zod_1.z.number().positive('Volume deve ser positivo').optional(),
    direction: zod_1.z.enum(['above', 'below']).optional(),
    // Agendamento
    alertDate: zod_1.z.string().datetime().optional(),
    alertTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM obrigatório').optional(),
    // Notificação e prioridade
    notificationType: zod_1.z.enum(['email', 'sms', 'push', 'system']).optional(),
    priority: zod_1.z.enum(['normal', 'alta', 'critica']).optional(),
    // Recorrência
    repetition: zod_1.z.enum(['once', 'diario', 'semanal']).optional(),
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    baseCurrency: zod_1.z.string().optional(),
});
exports.listAlertsQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().min(1)).optional().default('1'),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().min(1).max(100)).optional().default('10'),
    includeUser: zod_1.z.string().transform((v) => v === 'true').optional().default('false'),
    priority: zod_1.z.enum(['normal', 'alta', 'critica']).optional(), // Filtrar por prioridade
    tipo: zod_1.z.enum(['precoAlvo', 'altaPercentual', 'quedaPercentual', 'volume']).optional(), // Filtrar por tipo
    isActive: zod_1.z.string().transform((v) => v === 'true').optional(), // Filtrar por status
});
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido'),
});
//# sourceMappingURL=alerts.validator.js.map