const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin-model"); // <-- make sure path is correct
require("dotenv").config();

const isAdmin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Check if decoded email belongs to an admin
    const admin = await adminModel.findOne({ email: decoded.email }).select("-password");

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    req.admin = admin; // attach admin data to request
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = isAdmin;
