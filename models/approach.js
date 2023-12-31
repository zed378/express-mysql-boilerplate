const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");

const Approach = db.define(
  "approach",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    companyId: {
      type: DataTypes.STRING,
    },
    platformId: {
      type: DataTypes.STRING,
    },
    approachingBy: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
    statusId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
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

module.exports = { Approach };
