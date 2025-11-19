const service = require("./notification.service");

async function create(req, res) {
  try {
    const result = await service.create(req.userId, req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function list(req, res) {
  try {
    const result = await service.list(req.userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    await service.remove(req.userId, req.params.id);
    return res.json({ message: "Notificação removida" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { create, list, remove };
