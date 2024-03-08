const { db } = require("./");

async function Connection() {
  try {
    await db.authenticate();

    console.log("DB Connected");
  } catch (error) {
    console.log({
      status: "DB Connection Failed",
      message: error,
    });
    await db.authenticate();
  }
}

module.exports = { Connection };
