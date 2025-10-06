const express = require("express");
const router = express.Router();

const productCotroller = require("../controllers/product-controller");
const { validate } = require("../middleware/validation-middleware");
const productValidation = require("../validations/product-validation");
const upload = require("../config/multer-config");
const isAdmin = require("../middleware/isAdmin");

//For admin create only
router.get("/", (req,res)=>{
  res.render('upload');
}



);
// Create New Product
router.post(
  "/create",upload.single('image'),
  validate(productValidation.createProduct),
  productCotroller.createProduct
);

// Delete Product by ID
router.delete(
  "/delete/:id",
  productCotroller.deleteProduct
);
router.get("/fetchalladmin",isAdmin,productCotroller.fetchAllProductAdmin);



router.put('/:id',upload.single('image'),
productCotroller.editproduct)



module.exports = router;
