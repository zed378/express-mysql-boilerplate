const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { Connection } = require("./config");
const { ensureFolderExisted } = require("./src/middleware/createFolder");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");

// log
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const moment = require("moment-timezone");

// Ensure the log folder exists
ensureFolderExisted();

// Create a write stream (in append mode) for logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "log/access.log"),
  {
    flags: "a",
  }
);

// Define a custom token to format the timestamp in UTC+07:00
morgan.token("custom-date", (req, res) => {
  return moment().tz("Asia/Jakarta").format("DD/MMMM/YYYY HH:mm:ss ZZ");
});

// Define a custom format based on the "combined" format but replace the date with the custom token
const customFormat =
  ':remote-addr - :remote-user [:custom-date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

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
app.use(morgan(customFormat, { stream: accessLogStream }));

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
  res.send({
    status: "Success",
    message: "Your API is running",
  });
});

Connection();
const port = process.env.PORT;
app.listen(port, () => console.debug(`Server running on port: ${port}`));
