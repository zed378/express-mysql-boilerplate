const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { Connection } = require("./config");
const { ensureFolderExisted } = require("./src/middleware/createFolder");
const { formatErrorToHTML } = require("./src/middleware/convertToHtml");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const path = require("path");
const moment = require("moment-timezone");
const fs = require("fs");

const { activityLogger, logger } = require("./src/middleware/activityLog"); // Import activityLogger middleware

// Ensure the log folders exist
ensureFolderExisted();

// Define paths for access logs
const logDir = path.join(__dirname, "log");
const accessLogStream = fs.createWriteStream(
  path.join(
    logDir,
    `access/${moment().tz("Asia/Jakarta").format("YYYY-MM-DD")}-access.log`
  ),
  { flags: "a" }
);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register upload paths
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("src/static"));
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// app.use(limiter);
app.use(helmet());
app.use(xss());

// Custom token for morgan to format timestamp
morgan.token("custom-date", (req, res) => {
  return moment().tz("Asia/Jakarta").format("DD/MMMM/YYYY HH:mm:ss ZZ");
});

// Custom format based on combined but with custom date
const customFormat =
  ':remote-addr - :remote-user [:custom-date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Use morgan for access logging
app.use(morgan(customFormat, { stream: accessLogStream }));

// Use activityLogger middleware for activity logging
app.use(activityLogger);

// Routes
const authRoute = require("./src/routes/auth");
const migrateRoute = require("./src/routes/migrate");
const userRoute = require("./src/routes/user");
const mailRoute = require("./src/routes/mail");
const companyRoute = require("./src/routes/company");
const platformRoute = require("./src/routes/platform");
const statusRoute = require("./src/routes/status");
const approachRoute = require("./src/routes/approach");
const invRoutes = require("./src/routes/invoice");
const svcRoutes = require("./src/routes/service");
const categoryRoutes = require("./src/routes/category");
const productRoutes = require("./src/routes/product");

app.use("/auth", authRoute);
app.use("/migrate", migrateRoute);
app.use("/user", userRoute);
app.use("/mail", mailRoute);
app.use("/company", companyRoute);
app.use("/platform", platformRoute);
app.use("/status", statusRoute);
app.use("/approach", approachRoute);
app.use("/inv", invRoutes);
app.use("/svc", svcRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);

app.get("/error", (req, res, next) => {
  const err = new Error("This is a test error");
  err.status = 500;
  next(err);
});

app.use((err, req, res, next) => {
  const errorMessage = `Error - IP: ${req.ip}, Method: ${req.method}, URL: ${
    req.originalUrl
  }, Status: ${err.status || 500}, Message: ${err.message}`;

  const errorLog = {
    message: errorMessage,
    error: err.stack,
  };

  logger.error(errorLog);

  res
    .status(err.status || 500)
    .send(formatErrorToHTML("Error Has Been Occured", err.stack));
});

Connection();
const port = process.env.PORT;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
