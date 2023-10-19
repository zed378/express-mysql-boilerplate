const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("../config");

const Clients = db.define(
  "client",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING,
    },
    company_email: {
      type: DataTypes.STRING,
    },
    company_address: {
      type: DataTypes.STRING,
    },
    company_contact: {
      type: DataTypes.STRING,
    },
    company_industry: {
      type: DataTypes.STRING,
    },
    pic_name: {
      type: DataTypes.STRING,
    },
    pic_contact: {
      type: DataTypes.STRING,
    },
    pic_role: {
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

module.exports = { Clients };
