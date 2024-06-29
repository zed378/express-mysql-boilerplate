const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { Connection } = require("./config");
const { ensureFolderExisted } = require("./src/middleware/createFolder");
const { accessLog } = require("./src/middleware/accessLog");
const { formatErrorToHTML } = require("./src/middleware/convertToHtml");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");

const { activityLogger, logger } = require("./src/middleware/activityLog");

// Ensure necessary folders exist
ensureFolderExisted();

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

// Logging
app.use(accessLog);
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

// Endpoint
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

app.get("/", (req, res) => {
  res.status(200).send({
    status: "Success",
    message: "Your API is running",
  });
});

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
  console.log(`Server is running on port ${port}`);
});
