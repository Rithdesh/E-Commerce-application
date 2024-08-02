const orderController = require("../controllers/orderController");
const auth = require('../Middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/order',auth,orderController.placeOrder);
router.get('/order',auth,orderController.getOrders)

module.exports = router;

