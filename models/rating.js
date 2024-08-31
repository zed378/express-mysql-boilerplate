const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");
const { Users, Products } = require("./");

const Ratings = db.define(
  "ratings",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: Users,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.STRING,
      references: {
        model: Products,
        key: "id",
      },
    },
    rate: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.TEXT("long"),
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

module.exports = { Ratings };
