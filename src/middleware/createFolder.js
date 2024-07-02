const fs = require("fs");
const path = require("path");
const { logger } = require("./activityLog");

exports.ensureFolderExisted = () => {
  // Navigate to the root directory where index.js is located
  const rootDir = path.join(__dirname, "../../");

  const documentFolder = path.join(rootDir, "uploads/document");
  const invoiceFolder = path.join(rootDir, "uploads/invoice");
  const reportFolder = path.join(rootDir, "uploads/report");
  const backupFolder = path.join(rootDir, "backup");
  const dataFolder = path.join(rootDir, "data");
  const cloudbeaverFolder = path.join(rootDir, "data/cloudbeaver");
  const mysqlFolder = path.join(rootDir, "data/mysql");
  const pgadminFolder = path.join(rootDir, "data/pgadmin");
  const postgresFolder = path.join(rootDir, "data/postgres");
  const logFolder = path.join(rootDir, "log");
  const accessLog = path.join(rootDir, "log/access");
  const activityLog = path.join(rootDir, "log/activity");
  const debugLog = path.join(rootDir, "log/activity/debug");
  const errorLog = path.join(rootDir, "log/activity/error");
  const httpLog = path.join(rootDir, "log/activity/http");
  const infoLog = path.join(rootDir, "log/activity/info");
  const verboseLog = path.join(rootDir, "log/activity/verbose");
  const warnLog = path.join(rootDir, "log/activity/warn");

  // Check if document folder exists or not
  if (!fs.existsSync(documentFolder)) {
    fs.mkdirSync(documentFolder, { recursive: true });
    console.log("Document folder created.");
    logger.info("Document folder created.");
  } else {
    console.log("Document folder existed.");
    logger.info("Document folder existed.");
  }

  // Check if invoice folder exists or not
  if (!fs.existsSync(invoiceFolder)) {
    fs.mkdirSync(invoiceFolder, { recursive: true });
    console.log("Invoice folder created.");
    logger.info("Invoice folder created.");
  } else {
    console.log("Invoice folder existed.");
    logger.info("Invoice folder existed.");
  }

  // Check if report folder exists or not
  if (!fs.existsSync(reportFolder)) {
    fs.mkdirSync(reportFolder, { recursive: true });
    console.log("Report folder created.");
    logger.info("Report folder created.");
  } else {
    console.log("Report folder existed.");
    logger.info("Report folder existed.");
  }

  // Check if backup folder exists or not
  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
    console.log("Backup folder created.");
    logger.info("Backup folder created.");
  } else {
    console.log("Backup folder existed.");
    logger.info("Backup folder existed.");
  }

  // Check if data folder exists or not
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
    console.log("Data folder created.");
    logger.info("Data folder created.");
  } else {
    console.log("Data folder existed.");
    logger.info("Data folder existed.");
  }

  // Check if cloudbeaver folder exists or not
  if (!fs.existsSync(cloudbeaverFolder)) {
    fs.mkdirSync(cloudbeaverFolder, { recursive: true });
    console.log("Cloudbeaver folder created.");
    logger.info("Cloudbeaver folder created.");
  } else {
    console.log("Cloudbeaver folder existed.");
    logger.info("Cloudbeaver folder existed.");
  }

  // Check if mysql folder exists or not
  if (!fs.existsSync(mysqlFolder)) {
    fs.mkdirSync(mysqlFolder, { recursive: true });
    console.log("MySQL folder created.");
    logger.info("MySQL folder created.");
  } else {
    console.log("MySQL folder existed.");
    logger.info("MySQL folder existed.");
  }

  // Check if pgadmin folder exists or not
  if (!fs.existsSync(pgadminFolder)) {
    fs.mkdirSync(pgadminFolder, { recursive: true });
    console.log("PG Admin folder created.");
    logger.info("PG Admin folder created.");
  } else {
    console.log("PG Admin folder existed.");
    logger.info("PG Admin folder existed.");
  }

  // Check if postgres folder exists or not
  if (!fs.existsSync(postgresFolder)) {
    fs.mkdirSync(postgresFolder, { recursive: true });
    console.log("PostgreSQL folder created.");
    logger.info("PostgreSQL folder created.");
  } else {
    console.log("PostgreSQL folder existed.");
    logger.info("PostgreSQL folder existed.");
  }

  // Check if log folder exists or not
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder, { recursive: true });
    console.log("Log folder created.");
    logger.info("Log folder created.");
  } else {
    console.log("Log folder existed.");
    logger.info("Log folder existed.");
  }

  // Check if access log folder exists or not
  if (!fs.existsSync(accessLog)) {
    fs.mkdirSync(accessLog, { recursive: true });
    console.log("Access log folder created.");
    logger.info("Access log folder created.");
  } else {
    console.log("Access log folder existed.");
    logger.info("Access log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(activityLog)) {
    fs.mkdirSync(activityLog, { recursive: true });
    console.log("Activity log folder created.");
    logger.info("Activity log folder created.");
  } else {
    console.log("Activity log folder existed.");
    logger.info("Activity log folder existed.");
  }

  // Check if activity debug log folder exists or not
  if (!fs.existsSync(debugLog)) {
    fs.mkdirSync(debugLog, { recursive: true });
    console.log("Activity debug log folder created.");
    logger.info("Activity debug log folder created.");
  } else {
    console.log("Activity debug log folder existed.");
    logger.info("Activity debug log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(errorLog)) {
    fs.mkdirSync(errorLog, { recursive: true });
    console.log("Activity error log folder created.");
    logger.info("");
  } else {
    console.log("Activity errorlog folder existed.");
    logger.info("Activity error log folder created.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(httpLog)) {
    fs.mkdirSync(httpLog, { recursive: true });
    console.log("Activity http log folder created.");
    logger.info("Activity http log folder created.");
  } else {
    console.log("Activity http log folder existed.");
    logger.info("Activity http log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(infoLog)) {
    fs.mkdirSync(infoLog, { recursive: true });
    console.log("Activity info log folder created.");
    logger.info("Activity info log folder created.");
  } else {
    console.log("Activity info log folder existed.");
    logger.info("Activity info log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(verboseLog)) {
    fs.mkdirSync(verboseLog, { recursive: true });
    console.log("Activity verbose log folder created.");
    logger.info("Activity verbose log folder created.");
  } else {
    console.log("Activity verbose log folder existed.");
    logger.info("Activity verbose log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(warnLog)) {
    fs.mkdirSync(warnLog, { recursive: true });
    console.log("Activity warn log folder created.");
    logger.info("Activity warn log folder created.");
  } else {
    console.log("Activity warn log folder existed.");
    logger.info("Activity warn log folder existed.");
  }
};
