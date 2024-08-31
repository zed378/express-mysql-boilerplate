const { db } = require("./");
const { logger } = require("../src/middleware/activityLog");

async function Up() {
  try {
    db.sync({ alter: true });
    console.log("Database Synced");
    logger.info("Database Synced");
  } catch (error) {
    console.log(error);
  }
}

async function Down() {
  try {
    db.drop({});
    console.log("Table Dropped");
    logger.info("Table Dropped");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { Up, Down };
