const { Sequelize } = require("sequelize");

const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const port = process.env.DB_PORT;
const dialect = process.env.DB_DIALECT;

const mysql = {
  dialect,
  host,
  port,
  username: user,
  password: pass,
  database: dbName,
};

const pg = {
  dialect,
  host,
  port,
  username: user,
  password: pass,
  database: dbName,
  dialectOptions: {
    ssl: false,
  },
};

const db = new Sequelize(dialect === "mysql" ? mysql : pg);

module.exports = { db };
