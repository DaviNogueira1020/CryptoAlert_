"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criar = criar;
exports.listar = listar;
exports.buscarPorId = buscarPorId;
exports.atualizar = atualizar;
exports.remover = remover;
exports.ativarDesativar = ativarDesativar;
exports.duplicar = duplicar;
exports.exportar = exportar;
async function criar(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const { crypto, baseCurrency, targetPrice, direction, tipo, precoAlvo, percentualAlta, percentualQueda, volumeMinimo, 
        // novos campos
        titulo, descricao, prioridade, notificationType, repetition, alertDate, alertTime, 
        // legado
        isFavorite, isActive, notifyOnce, initialPrice, notes, cooldown, scheduledAt, isScheduled, searchKey, } = req.body;
        // Validação do mínimo necessário
        if (!crypto || !direction) {
            return res.status(400).json({
                error: "Campos obrigatórios ausentes",
                required: ["crypto", "direction"],
            });
        }
        const novoAlerta = await service.criar({
            userId,
            crypto,
            baseCurrency: baseCurrency ?? "USDT",
            targetPrice: Number(targetPrice ?? 0),
            direction,
            tipo: tipo ?? "preco",
            precoAlvo: precoAlvo ?? null,
            percentualAlta: percentualAlta ?? null,
            percentualQueda: percentualQueda ?? null,
            volumeMinimo: volumeMinimo ?? null,
            // novos campos CRUD
            titulo: titulo ?? null,
            descricao: descricao ?? null,
            prioridade: prioridade ?? "normal",
            notificationType: notificationType ?? "system",
            repetition: repetition ?? "once",
            alertDate: alertDate ?? null,
            alertTime: alertTime ?? null,
            // legado com defaults
            isFavorite: isFavorite ?? false,
            isActive: isActive ?? true,
            notifyOnce: notifyOnce ?? true,
            initialPrice: initialPrice ?? null,
            notes: notes ?? null,
            cooldown: cooldown ?? null,
            scheduledAt: scheduledAt ?? null,
            isScheduled: isScheduled ?? false,
            searchKey: searchKey ??
                `${crypto} ${crypto.toLowerCase()} ${crypto.toUpperCase()}`,
        });
        return res.status(201).json(novoAlerta);
    }
    catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Erro interno do servidor",
            code: err.code || "INTERNAL_ERROR",
        });
    }
}
async function listar(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const page = parseInt(req.query.page || "1");
        const limit = parseInt(req.query.limit || "10");
        const filters = {
            priority: req.query.priority,
            tipo: req.query.tipo,
            isActive: req.query.isActive,
        };
        const alertas = await service.listar(userId, page, limit, filters);
        return res.status(200).json(alertas);
    }
    catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Erro interno do servidor",
        });
    }
}
async function buscarPorId(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const { id } = req.params;
        const alerta = await service.buscarPorId(id, userId);
        return res.status(200).json(alerta);
    }
    catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Erro interno do servidor",
        });
    }
}
async function atualizar(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const { id } = req.params;
        const dadosAtualizacao = req.body;
        const alertaAtualizado = await service.atualizar(id, userId, dadosAtualizacao);
        return res.status(200).json(alertaAtualizado);
    }
    catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Erro interno do servidor",
        });
    }
}
async function remover(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const { id } = req.params;
        await service.remover(id, userId);
        return res.status(200).json({ message: "Alerta removido com sucesso" });
    }
    catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Erro interno do servidor",
        });
    }
}
async function ativarDesativar(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const { id } = req.params;
        const alerta = await service.ativarDesativar(id, userId);
        return res.status(200).json(alerta);
    }
    catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Erro interno do servidor",
        });
    }
}
async function duplicar(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const { id } = req.params;
        const alerta = await service.duplicar(id, userId);
        return res.status(201).json(alerta);
    }
    catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Erro interno do servidor",
        });
    }
}
async function exportar(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const formato = req.query.formato || "json";
        const dados = await service.exportar(userId, formato);
        if (formato === "csv") {
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=alertas.csv");
        }
        else {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Content-Disposition", "attachment; filename=alertas.json");
        }
        return res.status(200).send(dados);
    }
    catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Erro interno do servidor",
        });
    }
}
//# sourceMappingURL=alerts.controller.js.map