const cron = require("node-cron");
const axios = require("axios");

const JSZip = require("jszip");
const fse = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

const rootDir = path.join(__dirname, "../../");

async function addFolderToZip(zip, folderPath, folderName = "") {
  const files = await fse.readdir(folderPath);

  for (const fileName of files) {
    const fullPath = path.join(folderPath, fileName);
    const fileStat = await fse.stat(fullPath);

    if (fileStat.isDirectory()) {
      const subFolderName = path.join(folderName, fileName);
      await addFolderToZip(zip, fullPath, subFolderName);
    } else {
      const fileData = await fse.readFile(fullPath);
      zip.file(path.join(folderName, fileName), fileData);
    }
  }
}

async function zipFolder(source, out) {
  const zip = new JSZip();
  await addFolderToZip(zip, source);
  const zipContent = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  await fse.writeFile(out, zipContent);
}

async function backupAndZip() {
  const prefix = moment().tz("Asia/Jakarta").format("YYYY-MMMM-DD HH~mm~ss");

  const dataSourceDir = path.join(rootDir, "data");
  const logSourceDir = path.join(rootDir, "log");
  const backupDir = path.join(rootDir, "backup");

  const dataOutPath = path.join(backupDir, `${prefix}-data.zip`);
  const logOutPath = path.join(backupDir, `${prefix}-log.zip`);

  const tempDataBackupDir = path.join(backupDir, `${prefix}-data`);
  const tempLogBackupDir = path.join(backupDir, `${prefix}-log`);

  try {
    await fse.ensureDir(backupDir);

    await fse.copy(logSourceDir, tempLogBackupDir);

    await zipFolder(tempLogBackupDir, logOutPath);
    console.log("Log folder successfully zipped!");

    await fse.remove(tempLogBackupDir);

    await fse.copy(dataSourceDir, tempDataBackupDir, {
      filter: (src) => !src.endsWith("mysql.sock"),
    });

    await zipFolder(tempDataBackupDir, dataOutPath);
    console.log("Data folder successfully zipped!");

    await fse.remove(tempDataBackupDir);

    console.log("Temporary folders successfully deleted!");
  } catch (err) {
    console.error("Error during backup and zipping process:", err);
  }
}

const cronBackup = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running backup task every minute for testing");

    try {
      const response = await axios.get("http://localhost:5000/backup/start");
      console.log("Backup response:", response.data);
    } catch (error) {
      console.error("Error during backup request:", error.message);
    }
  });
};

module.exports = { backupAndZip, cronBackup };
