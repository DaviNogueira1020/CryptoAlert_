const { Request, Response } = require("express");
const { AuthService } = require("../services/auth.service");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      const result = await this.authService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const result = await this.authService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  me = async (req, res) => {
    try {
      const result = await this.authService.me(req.userId);
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
}

module.exports = { AuthController };
