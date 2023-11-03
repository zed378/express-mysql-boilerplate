const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");

const Invoice = db.define(
  "invoice",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    inv_created: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    inv_due: {
      type: DataTypes.DATE,
    },
    inv_num: {
      type: DataTypes.STRING,
      unique: true,
    },
    companyId: {
      type: DataTypes.STRING,
    },
    discount: {
      type: DataTypes.STRING,
    },
    stateTax: {
      type: DataTypes.STRING,
    },
    fedTax: {
      type: DataTypes.STRING,
    },
    ship: {
      type: DataTypes.STRING,
    },
    items: {
      type: DataTypes.JSON,
    },
    total: {
      type: DataTypes.STRING,
    },
    filename: {
      type: DataTypes.STRING,
      unique: true,
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

module.exports = { Invoice };
