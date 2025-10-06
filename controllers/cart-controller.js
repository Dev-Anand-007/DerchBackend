const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

const cartController = {
async fetchUserCart(req, res) {
  try {
    let user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");

    let userCart = user.cart;
    if (!userCart || user.cart.length == 0) {
      return res.status(200).json({
        success: false,
        message: "Empty Cart",
        cart:[]
      });
    }

    // Convert items & remove image
    let cart = userCart.map((item) => {
      let product = item.toObject();
      delete product.image;
      return product;
    });

    // ✅ Calculate totals
    let { subtotal, totalDiscount } = cart.reduce(
      (acc, item) => {
        const price = item.price || 0;
        const discount = item.discount || 0;

        acc.subtotal += price;
        acc.totalDiscount += discount;

        return acc;
      },
      { subtotal: 0, totalDiscount: 0 }
    );

    let finalTotal = subtotal + totalDiscount; // since total price = price + discount

    return res.status(200).json({
      success: true,
      message: "Cart item fetched successfully",
      cartCount: cart.length,
      cart: cart,
      subtotal,
      totalDiscount,
      finalTotal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during application",
      error: error.message,
    });
  }
},

  async addProduct(req, res) {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const product = await productModel.findById(req.params.id).select("-image");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Check if already in cart
    if (user.cart.includes(req.params.id)) {
      return res.status(200).json({
        success: false,
        message: "Product already in cart.",
        product,
      });
    }

    // ✅ Otherwise add to cart
    user.cart.push(req.params.id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Successfully added to cart.",
      product,
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Add to Cart Failed",
    });
  }
}
,
  async deleteProduct(req, res) {
    try {
      let user = await userModel.findOne({ email: req.user.email });
      let product = await productModel.findById(req.params.id).select("-image");
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      user.cart = user.cart.filter((item) => item.toString() !== req.params.id);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Product removed from cart successfully.",
        product: product,
      });
    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Remove from Cart Failed",
      });
    }
  },
};

module.exports = cartController;
