const express = require("express");
const router = express.Router();

const productCotroller = require("../controllers/product-controller");
const productModel=require('../models/product-model');
const { validate } = require("../middleware/validation-middleware");
const productValidation = require("../validations/product-validation");
const upload = require("../config/multer-config");
const isLoggedin = require("../middleware/isLoggedin");


router.get("/",isLoggedin,productCotroller.fetchAllProduct);

router.get("/discounted",isLoggedin,productCotroller.productDiscounted);

router.get("/new",isLoggedin,productCotroller.newProduct);

router.get("/sort",isLoggedin,productCotroller.priceSort);


router.get("/image/:id", productCotroller.fetchImage);


//For Admin
router.post(
  "/create",upload.single('image'),
  validate(productValidation.createProduct),
  productCotroller.createProduct
);




module.exports = router;
