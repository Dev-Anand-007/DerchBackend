const express = require("express");
const router = express.Router();
const {validate}=require('../middleware/validation-middleware');

const authController = require("../controllers/auth-controller");
const userValidation = require("../validations/user-validations");

//User Register
router.post(
  "/register",
  validate(userValidation.registerUser),  // ✅ Joi validation here
  authController.register
);
//User Login
router.post('/login',authController.login)

//Check Auth User
router.get('/check-auth',authController.checkAuth)

//User Logout --> Not required, Since token will be handled by frontend
router.get('/logout',authController.logout)

module.exports = router;
