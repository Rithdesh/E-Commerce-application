const productController = require('../controllers/productController');
const express = require('express');
const auth = require('../Middleware/auth')
const router = express.Router();


router.get("/products",productController.getAllProducts);
router.post("/create",productController.createProducts)
router.delete("/products/:id",productController.deletebyid)
router.patch("/products/:id",productController.updateProductByid)


module.exports = router;
