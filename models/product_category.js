const { DataTypes } = require("sequelize");
const { db } = require("../config");

const ProductCategories = db.define(
  "product_categories",
  {
    productId: {
      type: DataTypes.STRING,
      references: {
        model: "products",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.STRING,
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = { ProductCategories };
