const { user, session } = require('../models'); // tout en minuscule
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

class AuthController {
  // login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const foundUser = await user.findOne({ where: { email } });
      if (!foundUser) return res.status(404).json({ message: 'utilisateur non trouvé' });

      const match = await bcrypt.compare(password, foundUser.password);
      if (!match) return res.status(400).json({ message: 'mot de passe incorrect' });

      const payload = { id: foundUser.id, role: foundUser.role };
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
      let refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await session.create({
        user_id: foundUser.id,
        refresh_token: refreshTokenHash,
        revoked: false,
        expires_at: expiresAt
      });

      res.json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  // refresh token
  async refreshToken(req, res, next) {
    try {
      const { token, userId } = req.body;
      if (!token) return res.status(401).json({ message: 'refresh token manquant' });

      const foundUser = await user.findByPk(userId);
      if (!foundUser) return res.status(404).json({ message: 'utilisateur inexistant' });

      const sessions = await session.findAll({ where: { user_id: userId, revoked: false } });
      const userSession = sessions.find(s => bcrypt.compareSync(token, s.refresh_token));

      if (!userSession) return res.status(403).json({ message: 'refresh token invalide' });

      try {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      } catch (err) {
        await this.revokeRefreshToken(userSession);
        return res.status(403).json({ message: 'refresh token expiré' });
      }

      await this.revokeRefreshToken(userSession);

      const newRefresh = jwt.sign({ id: foundUser.id, role: foundUser.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
      let refreshToken = await bcrypt.hash(newRefresh, 10);
      await session.create({
        user_id: foundUser.id,
        refresh_token: refreshToken,
        revoked: false,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      const newAccessToken = jwt.sign({ id: foundUser.id, role: foundUser.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
      res.json({ accessToken: newAccessToken, refreshToken: newRefresh });

    } catch (err) {
      next(err);
    }
  }

  async revokeRefreshToken(userSession) {
    userSession.revoked = true;
    await userSession.save();
  }

  async logout(req, res, next) {
    const { token, userId } = req.body;
      if (!token) return res.status(401).json({ message: 'refresh token manquant' });

      const foundUser = await user.findByPk(userId);
      if (!foundUser) return res.status(404).json({ message: 'utilisateur inexistant' });

      const sessions = await session.findAll({ where: { user_id: userId, revoked: false } });
      const userSession = sessions.find(s => bcrypt.compareSync(token, s.refresh_token));
      if (!userSession) return res.status(403).json({ message: 'refresh token invalide' });

      await this.revokeRefreshToken(userSession);

      res.json({ message: 'déconnexion réussie' });
  }
}

module.exports = new AuthController();
