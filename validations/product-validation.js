const joi = require("joi");

const productValidation = {
  createProduct: joi.object({
    name: joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.empty": "Product name is required",
        "string.min": "Product name must be at least 2 characters"
      }),

    price: joi.number()
      .required()
      .min(1)
      .messages({
        "number.min": "Price must be at least 1"
      }),

    discount: joi.number()
      .default(0)
      .min(0),

    bgColor: joi.string()
      .pattern(/^#([0-9A-Fa-f]{6})$/)
      .default("#FFFFFF")
      .messages({
        "string.pattern.base": "bgColor must be a valid hex color (e.g. #FFFFFF)",
      }),

    panelColor: joi.string()
      .pattern(/^#([0-9A-Fa-f]{6})$/)
      .default("#D3D3D3")
      .messages({
        "string.pattern.base": "panelColor must be a valid hex color (e.g. #D3D3D3)",
      }),

    textColor: joi.string()
      .pattern(/^#([0-9A-Fa-f]{6})$/)
      .default("#000000")
      .messages({
        "string.pattern.base": "textColor must be a valid hex color (e.g. #000000)",
      }),

    // ✅ Add booleans (coming as strings "true"/"false")
    isNew: joi.boolean()
      .truthy("true")
      .falsy("false")
      .default(false),

    isSale: joi.boolean()
      .truthy("true")
      .falsy("false")
      .default(false),

    isCollection: joi.boolean()
      .truthy("true")
      .falsy("false")
      .default(false),
  })
};

module.exports = productValidation;
