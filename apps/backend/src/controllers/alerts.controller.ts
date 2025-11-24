async criar(req, res) {
  try {
    const {
      userId,
      crypto,
      baseCurrency,
      targetPrice,
      direction,

      // opcionais
      isFavorite,
      isActive,
      notifyOnce,
      initialPrice,
      title,
      notes,
      cooldown,
      scheduledAt,
      isScheduled,
      searchKey,
    } = req.body;

    // Validação do mínimo necessário
    if (!userId || !crypto || !targetPrice || !direction) {
      return res.status(400).json({
        error: "Campos obrigatórios ausentes",
        required: ["userId", "crypto", "targetPrice", "direction"],
      });
    }

    const novoAlerta = await service.criar({
      // obrigatórios
      userId: Number(userId),
      crypto,
      baseCurrency: baseCurrency ?? "USDT",
      targetPrice: Number(targetPrice),
      direction,

      // opcionais com defaults
      isFavorite: isFavorite ?? false,
      isActive: isActive ?? true,
      notifyOnce: notifyOnce ?? true,
      initialPrice: initialPrice ?? null,
      title: title ?? null,
      notes: notes ?? null,
      cooldown: cooldown ?? null,
      scheduledAt: scheduledAt ?? null,
      isScheduled: isScheduled ?? false,

      // gerado automaticamente se não vier
      searchKey:
        searchKey ??
        `${crypto} ${crypto.toLowerCase()} ${crypto.toUpperCase()}`,
    });

    return res.status(201).json(novoAlerta);
  } catch (err) {
    return res.status(err.status || 500).json({
      error: err.message || "Erro interno do servidor",
      code: err.code || "INTERNAL_ERROR",
    });
  }
}
