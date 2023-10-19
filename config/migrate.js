const { Users, Clients, Approach, Platform } = require("../models");

async function Up() {
  try {
    await Users.sync({ alter: true });
    await Clients.sync({ alter: true });
    await Approach.sync({ alter: true });
    await Platform.sync({ alter: true });
    console.log("Database Synced");
  } catch (error) {
    console.log(error);
  }
}

async function Down() {
  try {
    Users.drop();
    Clients.drop();
    Approach.drop();
    Platform.drop();
    console.log("Table Dropped");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { Up, Down };
