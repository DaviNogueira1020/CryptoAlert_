import { z } from 'zod';

export const createAlertSchema = z.object({
  crypto: z.string().min(1, 'Cripto obrigatória').transform(v => v.toLowerCase()),
  tipo: z.enum(['precoAlvo', 'altaPercentual', 'quedaPercentual', 'volume']).default('precoAlvo'),
  
  // Condições (validadas conforme tipo)
  precoAlvo: z.number().positive('Preço deve ser positivo').optional(),
  percentualAlta: z.number().positive('Percentual deve ser positivo').optional(),
  percentualQueda: z.number().positive('Percentual deve ser positivo').optional(),
  volumeMinimo: z.number().positive('Volume deve ser positivo').optional(),
  
  direction: z.enum(['above', 'below']).default('above'),
  
  // Agendamento e data/hora
  alertDate: z.string().datetime().optional(), // ISO 8601
  alertTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM obrigatório').optional(),
  
  // Notificação e prioridade
  notificationType: z.enum(['email', 'sms', 'push', 'system']).default('system'),
  priority: z.enum(['normal', 'alta', 'critica']).default('normal'),
  
  // Recorrência
  repetition: z.enum(['once', 'diario', 'semanal']).default('once'),
  
  title: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  baseCurrency: z.string().optional(),
}).refine(
  (data) => {
    if (data.tipo === 'precoAlvo' && !data.precoAlvo) return false;
    if (data.tipo === 'altaPercentual' && !data.percentualAlta) return false;
    if (data.tipo === 'quedaPercentual' && !data.percentualQueda) return false;
    if (data.tipo === 'volume' && !data.volumeMinimo) return false;
    return true;
  },
  {
    message: 'Condição obrigatória para o tipo de alerta selecionado',
  }
);

export const updateAlertSchema = z.object({
  crypto: z.string().min(1, 'Cripto obrigatória').transform(v => v.toLowerCase()).optional(),
  tipo: z.enum(['precoAlvo', 'altaPercentual', 'quedaPercentual', 'volume']).optional(),
  
  // Condições (todas opcionais na atualização)
  precoAlvo: z.number().positive('Preço deve ser positivo').optional(),
  percentualAlta: z.number().positive('Percentual deve ser positivo').optional(),
  percentualQueda: z.number().positive('Percentual deve ser positivo').optional(),
  volumeMinimo: z.number().positive('Volume deve ser positivo').optional(),
  
  direction: z.enum(['above', 'below']).optional(),
  
  // Agendamento
  alertDate: z.string().datetime().optional(),
  alertTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM obrigatório').optional(),
  
  // Notificação e prioridade
  notificationType: z.enum(['email', 'sms', 'push', 'system']).optional(),
  priority: z.enum(['normal', 'alta', 'critica']).optional(),
  
  // Recorrência
  repetition: z.enum(['once', 'diario', 'semanal']).optional(),
  
  title: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  baseCurrency: z.string().optional(),
});

export const listAlertsQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional().default('10'),
  includeUser: z.string().transform((v) => v === 'true').optional().default('false'),
  priority: z.enum(['normal', 'alta', 'critica']).optional(), // Filtrar por prioridade
  tipo: z.enum(['precoAlvo', 'altaPercentual', 'quedaPercentual', 'volume']).optional(), // Filtrar por tipo
  isActive: z.string().transform((v) => v === 'true').optional(), // Filtrar por status
});

export const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

// Type exports
export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;
export type ListAlertsQuery = z.infer<typeof listAlertsQuerySchema>;
