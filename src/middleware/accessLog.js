const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const morgan = require("morgan");

const logDir = path.join(__dirname, "../../log/access");

const accessLogStream = fs.createWriteStream(
  path.join(
    logDir,
    `${moment().tz("Asia/Jakarta").format("YYYY-MM-DD")}-access.log`
  ),
  { flags: "a" }
);

morgan.token("custom-date", (req, res) => {
  return moment().tz("Asia/Jakarta").format("DD/MMMM/YYYY HH:mm:ss ZZ");
});

const customFormat =
  ':remote-addr - :remote-user [:custom-date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

const accessLog = morgan(customFormat, {
  stream: accessLogStream,
});

module.exports = { accessLog };
