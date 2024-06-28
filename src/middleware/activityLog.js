const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, prettyPrint } = format;
const moment = require("moment-timezone");
const path = require("path");

const rootDir = path.join(__dirname, "../../");
const logDir = path.join(rootDir, "log/activity");

// Custom printf format
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Initialize logger instance
const logger = createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
  },
  format: combine(timestamp({ format: "DD-MMMM-YYYY HH:mm:ss ZZ" }), myFormat),
  transports: [
    // Error logger
    new transports.File({
      filename: `${logDir}/error/${moment()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD")}.log`,
      level: "error",
      format: combine(
        timestamp({ format: "DD-MMMM-YYYY HH:mm:ss ZZ" }),
        prettyPrint()
      ),
    }),
    // Warn logger
    new transports.File({
      filename: `${logDir}/warn/${moment()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD")}.log`,
      level: "warn",
      format: combine(
        timestamp({ format: "DD-MMMM-YYYY HH:mm:ss ZZ" }),
        prettyPrint()
      ),
    }),
    // Info logger
    new transports.File({
      filename: `${logDir}/info/${moment()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD")}.log`,
      level: "info",
      format: combine(
        timestamp({ format: "DD-MMMM-YYYY HH:mm:ss ZZ" }),
        prettyPrint()
      ),
    }),
    // HTTP logger
    new transports.File({
      filename: `${logDir}/http/${moment()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD")}.log`,
      level: "http",
      format: combine(
        timestamp({ format: "DD-MMMM-YYYY HH:mm:ss ZZ" }),
        prettyPrint()
      ),
    }),
    // Verbose logger
    new transports.File({
      filename: `${logDir}/verbose/${moment()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD")}.log`,
      level: "verbose",
      format: combine(
        timestamp({ format: "DD-MMMM-YYYY HH:mm:ss ZZ" }),
        prettyPrint()
      ),
    }),
    // Debug logger
    new transports.File({
      filename: `${logDir}/debug/${moment()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD")}.log`,
      level: "debug",
      format: combine(
        timestamp({ format: "DD-MMMM-YYYY HH:mm:ss ZZ" }),
        prettyPrint()
      ),
    }),
    // Console logger for all levels
    new transports.Console({
      level: "silly",
      format: combine(
        timestamp({ format: "DD-MMMM-YYYY HH:mm:ss ZZ" }),
        prettyPrint()
      ),
    }),
  ],
});

// Middleware function to log HTTP requests and responses
const activityLogger = (req, res, next) => {
  const start = Date.now();
  const { ip, method, originalUrl } = req;
  const requestMessage = `HTTP Request - IP: ${ip}, Method: ${method}, URL: ${originalUrl}`;

  logger.http(requestMessage);

  const originalSend = res.send;
  res.send = function (body) {
    res.send = originalSend;
    res.send(body);
    const duration = Date.now() - start;
    const responseMessage = `HTTP Response - IP: ${ip}, Method: ${method}, URL: ${originalUrl}, Status: ${res.statusCode}, Response: ${body}, Duration: ${duration}ms`;

    if (res.statusCode >= 500 && res.statusCode < 600) {
      logger.error(responseMessage);
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      logger.warn(responseMessage);
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      logger.info(responseMessage);
    } else if (res.statusCode >= 200 && res.statusCode < 300) {
      logger.http(responseMessage);
    } else if (res.statusCode >= 100 && res.statusCode < 200) {
      logger.info(responseMessage);
    } else {
      logger.verbose(responseMessage);
    }
  };

  res.on("close", () => {
    const duration = Date.now() - start;
    const logMessage = `HTTP Request Closed - IP: ${ip}, Method: ${method}, URL: ${originalUrl}, Duration: ${duration}ms`;

    logger.verbose(logMessage);
  });

  next();
};

module.exports = { activityLogger, logger };
