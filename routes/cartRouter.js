const express = require("express");
const router = express.Router();

const isLoggedin = require("../middleware/isLoggedin");
const cartController=require('../controllers/cart-controller')
const userModel=require('../models/user-model');
const productModel=require('../models/product-model');



//Show cart Item
router.get('/',isLoggedin,cartController.fetchUserCart);

//Add Items in Cart
router.post("/add/:id", isLoggedin,cartController.addProduct);

//Delete Items from Cart
router.delete("/delete/:id", isLoggedin,cartController.deleteProduct);







module.exports = router;
