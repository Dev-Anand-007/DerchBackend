const mongoose = require("mongoose");
const productModel = require("./product-model");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    minLength: 3,
    maxLength: 50,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
    maxLength: 15, // allowing for country code like +91
    match: /^[0-9+\- ]+$/, // regex to allow digits, +, -, and space
  },
   address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true, default: "India" }
    },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  contact: {
    type: Number,
  },
  picture: String,
});

//implementing index email is left

module.exports = mongoose.model("user", userSchema);
