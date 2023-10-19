const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");

const Approach = db.define(
  "approach",
  {
    id: {
      type: DataTypes.UUID,
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
    status: {
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
      defaultValue: "APPROACHING",
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
