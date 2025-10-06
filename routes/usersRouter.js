const express = require("express");
const router = express.Router();

const productsRouters=require('./productsRouter')
const cartRouters=require('./cartRouter')
const wishlistRouters=require('./wishlistRouter')

const orderRouters=require('./orderRouter')


router.use('/products',productsRouters)

router.use('/cart',cartRouters)

router.use('/wishlist',wishlistRouters)

router.use('/orders',orderRouters)


module.exports = router;
