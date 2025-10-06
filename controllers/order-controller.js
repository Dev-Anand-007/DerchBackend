const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

const orderController = {
  async fetchAllOrder(req, res)  {
  try {
    // Fetch users who have orders
    const usersWithOrders = await userModel
      .find({
        orders: { $exists: true, $ne: [] }, // Users with non-empty orders
      })
      .select("fullname email orders createdAt") // User fields
      .sort({ createdAt: -1 });

    if (!usersWithOrders || usersWithOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    // Map over users and fetch product details for their orders
    const usersWithOrderDetails = await Promise.all(
      usersWithOrders.map(async (user) => {
        const products = await productModel.find({
          _id: { $in: user.orders },
        }).select("-image"); // return all fields except image buffer

        return {
          _id: user._id,
          name: user.fullname,
          email: user.email,
          createdAt: user.createdAt,
          orders: products,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      count: usersWithOrderDetails.length,
      users: usersWithOrderDetails,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
},


  async fetchUserOrder(req, res) {
    try {
      console.log(req.user);
      let user = await userModel
        .findOne({ email: req.user.email })
        .populate("orders", "-image");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No User Found",
        });
      }
      let orders = user.orders || [];

      return res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        count: orders.length,
        orders: orders,
      });
    } catch (error) {
      console.error("Fetch orders error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  },

  async addOrder(req, res) {
    try {
      const user = await userModel.findOne({ email: req.user.email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.cart || user.cart.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty",
        });
      }

      // Update each product's status = false before moving to orders
    for (let productId of user.cart) {
      await productModel.findByIdAndUpdate(productId, { status: false });
    }

      user.orders.push(...user.cart);

      user.cart = [];
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Order Placed Successfully",
        orders: user.orders,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};

module.exports = orderController;
