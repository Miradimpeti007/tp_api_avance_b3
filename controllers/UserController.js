const { user } = require('../models');

class UserController {
  // GET /api/user/profile
  async getUser(req, res, next) {
    try {
      const userId = req.user.id; 
      const foundUser = await user.findByPk(userId, {
        attributes: ['id', 'email', 'role'] 
      });

      if (!foundUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
      res.json({ user: foundUser });
    } catch (err) {
      next(err);
    }
  }
  async createUser(req, res, next) {
    try {
      const { email, password, role } = req.body;

      const newUser = await user.create({
        email,
        password: password,
        role: role || 'user'
      });

      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
