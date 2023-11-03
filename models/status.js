const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");

const Status = db.define(
  "status",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM,
      values: [
        "APPROACHING",
        "MEETING",
        "QUOTATION SENT",
        "CONTRACT SENT",
        "DOWN PAYMENT",
        "PROJECT ON PROGRESS",
        "PROJECT DONE",
        "INVOICE SENT",
        "LAST PAYMENT DONE",
      ],
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

module.exports = { Status };
