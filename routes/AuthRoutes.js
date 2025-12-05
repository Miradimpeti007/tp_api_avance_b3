const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/login', (req, res, next) => AuthController.login (req, res, next));
router.post('/refresh', (req, res, next) => AuthController.refreshToken(req, res, next));
router.post('/logout', (req, res, next) => AuthController.logout(req, res, next));

module.exports = router;
