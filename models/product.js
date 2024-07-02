const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");

const Products = db.define(
  "products",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    price: {
      type: DataTypes.INTEGER,
    },
    description: { type: DataTypes.TEXT("long") },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    size: {
      type: DataTypes.STRING,
    },
    stock: {
      type: DataTypes.INTEGER,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      onUpdate: Sequelize.NOW,
    },
  },
  { freezeTableName: true, timestamps: true }
);

module.exports = { Products };
