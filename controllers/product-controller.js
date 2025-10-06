const productModel = require("../models/product-model");

const productController = {

   async fetchAllProductAdmin(req, res) {
    try {
      let products = await productModel.find({},{ image: 0 }); // exclude image field

      return res.status(200).json({
        success: true,
        productCount: products.length,
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  },
async createProduct(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Image upload failed or missing",
      });
    }

    // Extract body
    let { 
      name, 
      price, 
      discount, 
      bgColor, 
      panelColor, 
      textColor, 
      isNew, 
      isSale, 
      isCollection 
    } = req.body;

    console.log("Raw req.body:", req.body);

    // ✅ Normalize boolean fields
    const normalizeBoolean = (val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "string") return val.toLowerCase() === "true";
      return false;
    };

    isNew = normalizeBoolean(isNew);
    isSale = normalizeBoolean(isSale);
    isCollection = normalizeBoolean(isCollection);

    // ✅ Create product
    let uploadedData = await productModel.create({
      image: req.file.buffer,
      name,
      price,
      discount,
      bgColor,
      panelColor,
      textColor,
      isNewProduct: isNew, // <- maps correctly
      isSale,
      isCollection,
    });

    // Remove image buffer from response
    let newProduct = uploadedData.toObject();
    delete newProduct.image;

    res.status(200).json({
      status: true,
      message: "Product uploaded successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during application",
      error: error.message,
    });
  }
},


  async editproduct(req, res) {
    try {
      let id = req.params.id;

      let product = await productModel.findById(id);

      if (!product) {
        return res.status(400).json({
          status: false,
          message: "Product not found",
        });
      }
      let { name, price, discount, bgColor, panelColor, textColor } = req.body;

      // Update fields if provided
      if (req.file) {
        product.image = req.file.buffer;
      }
      if (name) product.name = name;
      if (price) product.price = price;
      if (discount) product.discount = discount;
      if (bgColor) product.bgColor = bgColor;
      if (panelColor) product.panelColor = panelColor;
      if (textColor) product.textColor = textColor;

      // Save updated product
      let updatedProduct = await product.save();

      let newProduct = updatedProduct.toObject();
      delete newProduct.image;

      res.status(200).json({
        status: true,
        message: "Product updated successfully",
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error during application",
        error: error.message,
      });
    }
  },
// controller/productController.js
async deleteProduct(req, res) {
  try {
    const { id } = req.params;

    // Validate ID format if you're using MongoDB
    if (!id || id.length !== 24) {
      return res.status(400).json({
        status: false,
        message: "Invalid product ID",
      });
    }

    const deleted = await productModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
      deletedProduct: deleted,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error during deletion",
      error: error.message,
    });
  }
},

  async fetchAllProduct(req, res) {
    try {
      let products = await productModel.find({ status: true }, { image: 0 }); // exclude image field

      return res.status(200).json({
        success: true,
        productCount: products.length,
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  },

  async productDiscounted(req, res) {
    try {
      let products = await productModel.find(
        { discount: { $gt: 0 } },
        { image: 0 }
      ); // exclude image field

      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No discounted products found",
        });
      }

      return res.status(200).json({
        success: true,
        productCount: products.length,
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch discounted products",
        error: error.message,
      });
    }
  },
  async newProduct(req, res) {
    try {
      let products = await productModel
        .find({}, { image: 0 })
        .sort({ createdAt: -1 }); // exclude image field

      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Product Available",
        });
      }

      return res.status(200).json({
        success: true,
        productCount: products.length,
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch discounted products",
        error: error.message,
      });
    }
  },

  async priceSort(req, res) {
    try {
      //Low to High
      let products = await productModel
        .find({}, { image: 0 })
        .sort({ price: -1 }); // exclude image field

      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Product Available",
        });
      }

      return res.status(200).json({
        success: true,
        productCount: products.length,
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch discounted products",
        error: error.message,
      });
    }
  },

  async fetchImage(req, res) {
    try {
      const id = req.params.id;

      const product = await productModel.findById(id).select("image");

      if (!product || !product.image) {
        return res.status(404).json({
          success: false,
          message: "Image not found",
        });
      }

      res.set("Content-Type", "image/png");

      res.send(product.image); // send binary data directly
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Image not available",
        error: error.message,
      });
    }
  },
};

module.exports = productController;
