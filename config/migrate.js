const { db } = require("./");

async function Up() {
  try {
    process.env.DB_DIALECT === "mysql" &&
      (await db.query("CREATE DATABASE IF NOT EXISTS webcompose", {
        raw: true,
      }));
    db.sync({ alter: true });
    console.log("Database Synced");
  } catch (error) {
    console.log(error);
  }
}

async function Down() {
  try {
    db.drop();
    console.log("Table Dropped");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { Up, Down };
