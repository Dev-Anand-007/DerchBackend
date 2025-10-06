const express=require('express');
const isAdmin = require('../middleware/isAdmin');
const isLoggedin = require('../middleware/isLoggedin');
const router=express.Router();

const orderController=require('../controllers/order-controller')

//For admin only
router.get('/all',isAdmin,orderController.fetchAllOrder)

//For user only
router.get('/',isLoggedin,orderController.fetchUserOrder);

router.get('/create',isLoggedin,orderController.addOrder);


module.exports=router;