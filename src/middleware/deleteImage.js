const fs = require("fs");
const path = require("path");

exports.delImg = (filePath) => {
  if (filePath !== "default.svg") {
    filePath = path.join(__dirname, "../../uploads/", filePath);

    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
  }
};
