const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const cartController = require('../controllers/cartCotroller');

router.post('/cart',auth,cartController.addOrUpdateCart);
router.get('/cart',auth,cartController.getCartDetails)
router.delete('/cart',auth,cartController.deleteItems)

module.exports = router;