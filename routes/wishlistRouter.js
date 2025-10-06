const express = require("express");
const router = express.Router();

const isLoggedin = require("../middleware/isLoggedin");
const wishlistController=require('../controllers/wishlist-controller')
const userModel=require('../models/user-model');
const productModel=require('../models/product-model');



//Show cart Item
router.get('/',isLoggedin,wishlistController.fetchUserwishlist);

//Add Items in Cart
router.post("/add/:id", isLoggedin,wishlistController.addProduct);

//Delete Items from Cart
router.delete("/delete/:id", isLoggedin,wishlistController.deleteProduct);







module.exports = router;
