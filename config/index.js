const { Sequelize } = require("sequelize");

const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const port = process.env.DB_PORT;

const db = new Sequelize({
  dialect: "mysql",
  host: host,
  port: port,
  username: user,
  password: pass,
  database: dbName,
});

module.exports = { db };
