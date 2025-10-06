const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

const { generateToken } = require("../utils/generateToken");

const authController = {
async register(req, res) {
  try {
    const { fullname, email, password, phone, contact, address } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    let newUser = await userModel.create({
      fullname,
      email,
      phone,
      contact,
      address,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(newUser);

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
      accessToken: token,
    });
  } catch (error) {
    logger.routes("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
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
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const token = generateToken(user);

      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: userResponse,
          token,
        },
        
      });

    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during login",
        error: error.message,
      });
    }
  },

  async checkAuth(req, res) {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_KEY);

      const user = await userModel
        .findOne({ email: decoded.email })
        .select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Authenticated",
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  },

  logout(req, res) {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },
};

module.exports = authController;
