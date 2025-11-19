const service = require("./auth.service");

async function register(req, res) {
  try {
    const result = await service.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const result = await service.login(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

module.exports = { register, login };
