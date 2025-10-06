const express = require("express");
const router = express.Router();
const adminProductsRouters=require('./adminProductRouter');

const orderRouters=require('./orderRouter')

const adminController = require("../controllers/admin-controller");
const isAdmin=require('../middleware/isAdmin')

//baseURL
router.get("/", adminController.admin);

//Admin Creation --> Only for developement environment
if (process.env.NODE_ENV === "development") {
    router.post("/create",adminController.create );
}

//admin Login
router.post('/login',adminController.login)

//verifying token
router.get('/check',adminController.checkAuth)

//admin Data
router.get('/fetch/:id',adminController.getAdminById)

router.get('/fetchUser',isAdmin,adminController.getAllUsers)

//uploading product
router.use("/product",adminProductsRouters);



//Edit product
router.use("/orders",orderRouters);




module.exports = router;
