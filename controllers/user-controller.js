const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");


const { generateToken } = require("../utils/generateToken");
require("dotenv").config();

const userController = {
  async register(req, res) {
    try {
      const { fullname, email, password, contact, picture } = req.body;

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      //Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      let newUser = await userModel.create({
        email,
        fullname,
        password: hashedPassword,
        contact,
        picture,
      });

      let token = generateToken(newUser);

      // puttingInCookies
      // res.cookies('token',token);

      //Remove password form resposne
      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: "User registered Successfully",
        data: userResponse,
        accessToken: token,
      });
    } catch (error) {
      logger.routes("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during application",
        error: error.message,
      });
    }
  },

  async login(req, res) {
    try {
      let { email, password } = req.body;

      let user = await userModel.findOne({ email });

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const token = generateToken(user);

      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: userResponse,
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during login",
        error: error.message,
      });
    }
  },

  logout(req,res){
    return res.status(200).json({
    success: true,
    message: "Logged out successfully. Please remove token on client."
  });
  }
};

module.exports = userController;
