import { PrismaClient } from '@prisma/client';
import { CreateAlertInput, UpdateAlertInput } from '../validators/alerts.validator';

const prisma = new PrismaClient();

export class AlertsService {
  async criarAlerta(userId: number, data: CreateAlertInput) {
    return prisma.alert.create({
      data: {
        userId,
        crypto: data.crypto,
        tipo: data.tipo,
        precoAlvo: data.precoAlvo,
        percentualAlta: data.percentualAlta,
        percentualQueda: data.percentualQueda,
        volumeMinimo: data.volumeMinimo,
        direction: data.direction,
        title: data.title,
        description: data.description,
        isActive: data.isActive,
        baseCurrency: data.baseCurrency,
        alertDate: data.alertDate ? new Date(data.alertDate) : null,
        alertTime: data.alertTime,
        notificationType: data.notificationType,
        priority: data.priority,
        repetition: data.repetition,
      },
    });
  }

  async listarAlertas(
    userId: number,
    page: number = 1,
    limit: number = 10,
    includeUser: boolean = false,
    filters?: {
      priority?: string;
      tipo?: string;
      isActive?: boolean;
      crypto?: string;
    }
  ) {
    const skip = (page - 1) * limit;

    // Construir where clause com filtros
    const where: any = { userId };
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.tipo) where.tipo = filters.tipo;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.crypto) where.crypto = filters.crypto.toLowerCase();

    const [alertas, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: includeUser ? { user: { select: { id: true, name: true, email: true } } } : false,
      }),
      prisma.alert.count({ where }),
    ]);

    return {
      resultados: alertas,
      paginacao: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async obterAlerta(id: string, userId: number) {
    return prisma.alert.findFirst({
      where: { id, userId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async atualizarAlerta(id: string, userId: number, data: UpdateAlertInput) {
    // Verificar propriedade
    const alerta = await prisma.alert.findFirst({
      where: { id, userId },
    });

    if (!alerta) {
      throw new Error('Alerta não encontrado');
    }

    const updateData: any = {};
    if (data.crypto) updateData.crypto = data.crypto;
    if (data.tipo) updateData.tipo = data.tipo;
    if (data.precoAlvo !== undefined) updateData.precoAlvo = data.precoAlvo;
    if (data.percentualAlta !== undefined) updateData.percentualAlta = data.percentualAlta;
    if (data.percentualQueda !== undefined) updateData.percentualQueda = data.percentualQueda;
    if (data.volumeMinimo !== undefined) updateData.volumeMinimo = data.volumeMinimo;
    if (data.direction) updateData.direction = data.direction;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.baseCurrency !== undefined) updateData.baseCurrency = data.baseCurrency;
    if (data.alertDate) updateData.alertDate = new Date(data.alertDate);
    if (data.alertTime) updateData.alertTime = data.alertTime;
    if (data.notificationType) updateData.notificationType = data.notificationType;
    if (data.priority) updateData.priority = data.priority;
    if (data.repetition) updateData.repetition = data.repetition;

    return prisma.alert.update({
      where: { id },
      data: updateData,
    });
  }

  async removerAlerta(id: string, userId: number) {
    const alerta = await prisma.alert.findFirst({
      where: { id, userId },
    });

    if (!alerta) {
      throw new Error('Alerta não encontrado');
    }

    return prisma.alert.delete({
      where: { id },
    });
  }

  async ativarDesativarAlerta(id: string, userId: number, ativo: boolean) {
    const alerta = await prisma.alert.findFirst({
      where: { id, userId },
    });

    if (!alerta) {
      throw new Error('Alerta não encontrado');
    }

    return prisma.alert.update({
      where: { id },
      data: { isActive: ativo },
    });
  }

  // ✨ Funcionalidade avançada: Duplicar alerta
  async duplicarAlerta(id: string, userId: number) {
    const alerta = await prisma.alert.findFirst({
      where: { id, userId },
    });

    if (!alerta) {
      throw new Error('Alerta não encontrado');
    }

    // Criar cópia do alerta
    const novoAlerta = await prisma.alert.create({
      data: {
        userId: alerta.userId,
        crypto: alerta.crypto,
        baseCurrency: alerta.baseCurrency,
        tipo: alerta.tipo,
        precoAlvo: alerta.precoAlvo,
        percentualAlta: alerta.percentualAlta,
        percentualQueda: alerta.percentualQueda,
        volumeMinimo: alerta.volumeMinimo,
        direction: alerta.direction,
        isActive: true,
        isFavorite: false,
        notifyOnce: false,
        title: alerta.title ? `${alerta.title} (Cópia)` : 'Cópia do Alerta',
        description: alerta.description,
        alertDate: alerta.alertDate,
        alertTime: alerta.alertTime,
        notificationType: alerta.notificationType,
        priority: alerta.priority,
        repetition: alerta.repetition,
      },
    });

    return novoAlerta;
  }

  // ✨ Registrar disparo de alerta
  async registrarDisparo(id: string) {
    return prisma.alert.update({
      where: { id },
      data: {
        lastTriggeredAt: new Date(),
        triggerCount: { increment: 1 },
      },
    });
  }

  async obterAleratasAtivos() {
    return prisma.alert.findMany({
      where: { isActive: true },
      include: { user: true },
    });
  }

  // ✨ Exportar alertas para CSV/JSON
  async exportarAlertas(userId: number, formato: 'csv' | 'json' = 'json') {
    const alertas = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (formato === 'json') {
      return alertas;
    }

    // Gerar CSV
    const headers = [
      'ID',
      'Moeda',
      'Tipo',
      'Condição',
      'Prioridade',
      'Notificação',
      'Status',
      'Data de Criação',
    ];
    const rows = alertas.map((a) => [
      a.id,
      a.crypto,
      a.tipo,
      this.getCondicaoTexto(a),
      a.priority,
      a.notificationType,
      a.isActive ? 'Ativo' : 'Inativo',
      a.createdAt.toISOString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    return csv;
  }

  private getCondicaoTexto(alerta: any): string {
    if (alerta.tipo === 'precoAlvo') return `$${alerta.precoAlvo} ${alerta.direction === 'above' ? '↑' : '↓'}`;
    if (alerta.tipo === 'altaPercentual') return `+${alerta.percentualAlta}%`;
    if (alerta.tipo === 'quedaPercentual') return `-${alerta.percentualQueda}%`;
    if (alerta.tipo === 'volume') return `Vol: $${alerta.volumeMinimo}`;
    return '—';
  }
}
