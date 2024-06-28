const fs = require("fs");
const path = require("path");

exports.ensureFolderExisted = () => {
  // Navigate to the root directory where index.js is located
  const rootDir = path.join(__dirname, "../../");

  const documentFolder = path.join(rootDir, "uploads/document");
  const invoiceFolder = path.join(rootDir, "uploads/invoice");
  const reportFolder = path.join(rootDir, "uploads/report");
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
  } else {
    console.log("Document folder existed.");
  }

  // Check if invoice folder exists or not
  if (!fs.existsSync(invoiceFolder)) {
    fs.mkdirSync(invoiceFolder, { recursive: true });
    console.log("Invoice folder created.");
  } else {
    console.log("Invoice folder existed.");
  }

  // Check if report folder exists or not
  if (!fs.existsSync(reportFolder)) {
    fs.mkdirSync(reportFolder, { recursive: true });
    console.log("Report folder created.");
  } else {
    console.log("Report folder existed.");
  }

  // Check if log folder exists or not
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder, { recursive: true });
    console.log("Log folder created.");
  } else {
    console.log("Log folder existed.");
  }

  // Check if access log folder exists or not
  if (!fs.existsSync(accessLog)) {
    fs.mkdirSync(accessLog, { recursive: true });
    console.log("Access log folder created.");
  } else {
    console.log("Access log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(activityLog)) {
    fs.mkdirSync(activityLog, { recursive: true });
    console.log("Activity log folder created.");
  } else {
    console.log("Activity log folder existed.");
  }

  // Check if activity debug log folder exists or not
  if (!fs.existsSync(debugLog)) {
    fs.mkdirSync(debugLog, { recursive: true });
    console.log("Activity debug log folder created.");
  } else {
    console.log("Activity debug log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(errorLog)) {
    fs.mkdirSync(errorLog, { recursive: true });
    console.log("Activity error log folder created.");
  } else {
    console.log("Activity errorlog folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(httpLog)) {
    fs.mkdirSync(httpLog, { recursive: true });
    console.log("Activity http log folder created.");
  } else {
    console.log("Activity http log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(infoLog)) {
    fs.mkdirSync(infoLog, { recursive: true });
    console.log("Activity info log folder created.");
  } else {
    console.log("Activity info log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(verboseLog)) {
    fs.mkdirSync(verboseLog, { recursive: true });
    console.log("Activity verbose log folder created.");
  } else {
    console.log("Activity verbose log folder existed.");
  }

  // Check if activity log folder exists or not
  if (!fs.existsSync(warnLog)) {
    fs.mkdirSync(warnLog, { recursive: true });
    console.log("Activity warn log folder created.");
  } else {
    console.log("Activity warn log folder existed.");
  }
};
