const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");

const Service = db.define(
  "service",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    svcId: {
      type: DataTypes.ENUM,
      values: [
        "UIUX",
        "STW",
        "FIX",
        "WAPP",
        "FE",
        "BE",
        "FEAT",
        "MNT",
        "HOST",
        "DMN",
      ],
    },
    svc_num: {
      type: DataTypes.INTEGER,
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

module.exports = { Service };
