const fs = require("fs");
const path = require("path");

exports.ensureFolderExisted = () => {
  // Navigate to the root directory where index.js is located
  const rootDir = path.join(__dirname, "../../");

  const documentFolder = path.join(rootDir, "uploads/document");
  const invoiceFolder = path.join(rootDir, "uploads/invoice");
  const reportFolder = path.join(rootDir, "uploads/report");

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
};
