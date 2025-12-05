const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

router.get('/', AuthMiddleware, (req, res, next) => ProductController.getProducts(req, res, next));


module.exports = router;
