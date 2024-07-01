// const { Sequelize } = require("sequelize");

// const host = process.env.DB_HOST;
// const dbName = process.env.DB_NAME;
// const user = process.env.DB_USER;
// const pass = process.env.DB_PASS;
// const port = process.env.DB_PORT;
// const dialect = process.env.DB_DIALECT;

// const mysql = {
//   dialect,
//   host,
//   port,
//   timezone: "+07:00",
//   username: user,
//   password: pass,
//   database: dbName,
// };

// const pg = {
//   dialect,
//   host,
//   port,
//   username: user,
//   password: pass,
//   database: dbName,
//   timezone: "+07:00",
//   dialectOptions: {
//     ssl: false,
//   },
// };

// const db = new Sequelize(dialect === "mysql" ? mysql : pg);

// module.exports = { db };

const { Sequelize } = require("sequelize");

// Load environment variables
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const port = process.env.DB_PORT;
const dialect = process.env.DB_DIALECT;

const baseConfig = {
  dialect,
  host,
  port,
  username: user,
  password: pass,
  timezone: "+07:00",
};

const mysqlConfig = {
  ...baseConfig,
  database: dbName,
};

const pgConfig = {
  ...baseConfig,
  database: dbName,
  dialectOptions: {
    ssl: false,
    useUTC: false,
    timezone: "+07:00",
  },
  supportsSearchPath: false,
};

const config = dialect === "mysql" ? mysqlConfig : pgConfig;

// Function to create database if it doesn't exist
async function createDatabaseIfNotExists() {
  const sequelize = new Sequelize("", user, pass, {
    host,
    port,
    dialect,
  });

  try {
    if (dialect === "mysql") {
      await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    } else if (dialect === "postgres") {
      await sequelize
        .query(`CREATE DATABASE "${dbName}";`, { raw: true })
        .catch((err) => {
          // Error code 42P04 indicates the database already exists in PostgreSQL
          if (err.original.code !== "42P04") {
            throw err;
          }
        });
    }
    console.log(`Database ${dbName} created or already exists.`);
  } catch (error) {
    console.error("Unable to create database:", error.message);
    return false;
  } finally {
    await sequelize.close();
    return true;
  }
}

const db = new Sequelize(config);

async function Connection() {
  try {
    await createDatabaseIfNotExists();
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

module.exports = { db, Connection };
