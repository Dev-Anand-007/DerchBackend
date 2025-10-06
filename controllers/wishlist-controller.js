const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

const wishlistController = {
  async fetchUserwishlist(req, res) {
    try {
      let user = await userModel
        .findOne({ email: req.user.email })
        .populate("wishlist");
      let userwishlist = user.wishlist;
      if (!userwishlist || user.wishlist.length == 0) {
        return res.status(400).json({
          success: false,
          message: "Empty wishlist",
        });
      }

      let wishlist = userwishlist.map((item) => {
        let product = item.toObject();
        delete product.image;
        return product;
      });

      return res.status(200).json({
        success: true,
        message: "wishlist item fetched successfully",
        wishlistCount: wishlist.length,
        wishlist: wishlist,
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

    // ✅ Check if already in wishlist
    if (user.wishlist.includes(req.params.id)) {
      return res.status(200).json({
        success: false,
        message: "Product already in wishlist.",
        product,
      });
    }

    // ✅ Otherwise add to wishlist
    user.wishlist.push(req.params.id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Successfully added to wishlist.",
      product,
    });
  } catch (error) {
    console.error("Add to wishlist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Add to wishlist Failed",
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
      user.wishlist = user.wishlist.filter((item) => item.toString() !== req.params.id);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist successfully.",
        product: product,
      });
    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Remove from wishlist Failed",
      });
    }
  },
};

module.exports = wishlistController;
