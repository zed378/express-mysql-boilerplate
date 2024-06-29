const { backupAndZip } = require("../middleware/backup");

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
