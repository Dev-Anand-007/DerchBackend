const { version } = require("joi");
const adminModel = require("../models/admin-model");
const userModel = require("../models/user-model");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

const adminController = {
  async admin(req, res) {
    return res.render("upload");
  },

  async create(req, res) {
    try {
      let admin = await adminModel.find();
      if (admin.length > 0) {
        return res.status(503).json({
          status: false,
          message: "You don't have permission to create a new admin",
        });
      }

      let { fullname, email, password } = req.body;

      let hash = await bcrypt.hash(password, 12);

      let createdadmin = await adminModel.create({
        fullname,
        email,
        password: hash,
      });

      let newadmin = createdadmin.toObject();
      delete newadmin.password;

      res.status(200).json({
        status: true,
        admin: newadmin,
      });
    } catch (error) {
      logger.routes("admin Creation error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during application",
        error: error.message,
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Check if user exists
      const admin = await adminModel.findOne({ email });
      if (!admin) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // 2. Compare password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // 3. Generate JWT Token
      const token = generateToken(admin);

      // 4. Send Response
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name, // include what you need
        },
      });
    } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong, please try again",
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

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      // Find admin by decoded info
      const admin = await adminModel
        .findOne({ email: decoded.email })
        .select("-password");

      if (!admin) {
        return res
          .status(401)
          .json({ success: false, message: "Admin not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Admin authenticated",
        admin,
      });
    } catch (error) {
      console.error("checkAdmin error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  },

  async getAdminById(req, res) {
    try {
      const { id } = req.params; // get admin ID from route params

      // Search for admin in database
      const admin = await adminModel.findById(id).select("-password"); // exclude password

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      return res.status(200).json({
        success: true,
        admin, // return admin data
      });
    } catch (error) {
      console.error("Error fetching admin:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
  async getAllUsers(req, res) {
    try {
      // Fetch all users but exclude passwords
      const users = await userModel.find().select("-password");

      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching users",
        error: error.message,
      });
    }
  },
};

module.exports = adminController;
