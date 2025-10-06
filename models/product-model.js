const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  image: {
    type: Buffer,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  price: { 
    type: Number,
    required:true,
    min:1
 },
  discount: {
    type: Number,
    default: 0,
    min:0,
  },
  status: {
  type: Boolean,
  default: true, // true = available, false = sold
},
// 🔹 Flags
  isNewProduct: {
    type: Boolean,
    default: false,
  },
  isSale: {
    type: Boolean,
    default: false,
  },
  isCollection: {
    type: Boolean,
    default: false,
  },
bgColor: {
    type: String,
    default: "#FFFFFF", // white
    match: /^#([0-9A-Fa-f]{6})$/, // ✅ ensure valid hex color
  },
  panelColor: {
    type: String,
    default: "#D3D3D3", // light gray
    match: /^#([0-9A-Fa-f]{6})$/, 
  },
  textColor: {
    type: String,
    default: "#000000", // black
    match: /^#([0-9A-Fa-f]{6})$/, 
  },
}, {
  timestamps: true, // ✅ adds createdAt & updatedAt
});

module.exports = mongoose.model("product", productSchema);
