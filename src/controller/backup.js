const { backupAndZip, extractZip } = require("../middleware/backup");

const fse = require("fs-extra");
const path = require("path");
const JSZip = require("jszip");
const rootDir = path.join(__dirname, "../../");

exports.backup = async (req, res) => {
  try {
    backupAndZip();

    res.status(200).send({
      status: "Success",
      message: "Backup data started successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: error.message,
    });
  }
};

exports.restoreDataBackup = async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).send({
      status: "Error",
      message: "Filename is required",
    });
  }

  const backupFilePath = path.join(rootDir, "backup", filename);

  if (!(await fse.pathExists(backupFilePath))) {
    return res.status(404).send({
      status: "Error",
      message: "Backup file not found",
    });
  }

  const dataDir = path.join(rootDir, "data");

  try {
    // Extract the backup zip file and replace the existing files
    await extractZip(backupFilePath, dataDir);

    res.status(200).send({
      status: "Success",
      message: `Data backup ${filename} restored successfully`,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: `Error restoring data backup: ${error.message}`,
    });
  }
};

exports.restoreLogBackup = async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).send({
      status: "Error",
      message: "Filename is required",
    });
  }

  const backupFilePath = path.join(rootDir, "backup", filename);

  if (!(await fse.pathExists(backupFilePath))) {
    return res.status(404).send({
      status: "Error",
      message: "Backup file not found",
    });
  }

  const logDir = path.join(rootDir, "log");

  try {
    await extractZip(backupFilePath, logDir);

    res.status(200).send({
      status: "Success",
      message: `Log backup ${filename} restored successfully`,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: `Error restoring log backup: ${error.message}`,
    });
  }
};
