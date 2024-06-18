const { db } = require("../config");

const ProductCategories = db.define(
  "product_category",
  {},
  { timestamps: false }
);

module.exports = { ProductCategories };
