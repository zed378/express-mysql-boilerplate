const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");

const ProductCategories = db.define(
  "product_categories",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      onUpdate: Sequelize.NOW,
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = { ProductCategories };
