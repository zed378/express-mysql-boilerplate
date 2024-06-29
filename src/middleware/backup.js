const JSZip = require("jszip");
const fse = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

const rootDir = path.join(__dirname, "../../");

const prefix = moment().tz("Asia/Jakarta").format("YYYY-MMMM-DD HH~mm~ss");

const dataSourceDir = path.join(rootDir, "data");
const logSourceDir = path.join(rootDir, "log");
const backupDir = path.join(rootDir, "backup");

const dataOutPath = path.join(backupDir, `${prefix}-data.zip`);
const logOutPath = path.join(backupDir, `${prefix}-log.zip`);

const tempDataBackupDir = path.join(backupDir, `${prefix}-data`);
const tempLogBackupDir = path.join(backupDir, `${prefix}-log`);

async function addFolderToZip(zip, folderPath, folderName = "") {
  const files = await fse.readdir(folderPath);

  for (const fileName of files) {
    const fullPath = path.join(folderPath, fileName);

    if (fileName === "mysql.sock") {
      continue;
    }

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
  try {
    await fse.ensureDir(backupDir);

    await fse.copy(logSourceDir, tempLogBackupDir);

    await zipFolder(tempLogBackupDir, logOutPath);
    console.log("Log folder successfully zipped!");

    await fse.remove(tempLogBackupDir);

    await fse.copy(dataSourceDir, tempDataBackupDir, {
      filter: (src) => {
        return !src.includes("mysql.sock");
      },
    });

    await fse.chmod(tempDataBackupDir, 0o755);

    await zipFolder(tempDataBackupDir, dataOutPath);
    console.log("Data folder successfully zipped!");

    await fse.remove(tempDataBackupDir);

    console.log("Temporary folders successfully deleted!");

    await deleteOldZipFiles();
  } catch (err) {
    console.error("Error during backup and zipping process:", err);
  }
}

async function deleteOldZipFiles() {
  try {
    const files = await fse.readdir(backupDir);

    const thirtyDaysAgo = moment().subtract(30, "days");

    for (const file of files) {
      const filePath = path.join(backupDir, file);
      const fileStat = await fse.stat(filePath);
      const fileModificationDate = moment(fileStat.mtime);

      if (
        fileStat.isFile() &&
        file.endsWith(".zip") &&
        fileModificationDate.isBefore(thirtyDaysAgo)
      ) {
        await fse.remove(filePath);
        console.log(`Deleted old zip file: ${file}`);
      }
    }
  } catch (err) {
    console.error("Error deleting old zip files:", err);
  }
}

backupAndZip();
