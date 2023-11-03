const { db } = require("./");

async function Up() {
  try {
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
