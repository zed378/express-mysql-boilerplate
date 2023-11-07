const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { Connection } = require("./config/connection");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");

// routes
const authRoute = require("./src/routes/auth");
const migrateROute = require("./src/routes/migrate");
const userRoute = require("./src/routes/user");
const mailRoute = require("./src/routes/mail");
const companyRoute = require("./src/routes/company");
const platformRoute = require("./src/routes/platform");
const statusRoute = require("./src/routes/status");
const approachRoute = require("./src/routes/approach");
const invRoutes = require("./src/routes/invoice");
const svcRoutes = require("./src/routes/service");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// register upload paths
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("src/static"));
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(helmet());
app.use(xss());

app.use("/auth", authRoute);
app.use("/migrate", migrateROute);
app.use("/user", userRoute);
app.use("/mail", mailRoute);
app.use("/company", companyRoute);
app.use("/platform", platformRoute);
app.use("/status", statusRoute);
app.use("/approach", approachRoute);
app.use("/inv", invRoutes);
app.use("/svc", svcRoutes);
app.get("/", (req, res) => {
  res.send({
    status: "Success",
    message: "Your API is running",
  });
});

Connection();
const port = process.env.PORT;
app.listen(port, () => console.debug(`Server running on port: ${port}`));
