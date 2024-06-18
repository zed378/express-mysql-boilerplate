const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");

const Products = db.define(
  "product",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "category",
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
  { freezeTableName: true, timestamps: true }
);

module.exports = { Products };
