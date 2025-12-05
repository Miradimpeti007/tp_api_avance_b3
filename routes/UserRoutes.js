const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/AuthMiddleware');

// Route profil utilisateur protégée
router.get('/:id', authMiddleware, (req, res, next) => userController.getUser(req, res, next));
router.post('/', (req, res, next) => userController.createUser(req, res, next));

module.exports = router;
