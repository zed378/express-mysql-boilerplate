const { Clients } = require("./client");
const { Status } = require("./status");
const { Platform } = require("./platform");
const { Approach } = require("./approach");
const { Users } = require("./user");
const { Invoice } = require("./invoice");
const { Service } = require("./service");

// define database relation
Approach.belongsTo(Status, {
  foreignKey: "statusId",
  as: "status",
});
Approach.belongsTo(Platform, {
  foreignKey: "platformId",
  as: "platform",
});
Approach.belongsTo(Clients, {
  foreignKey: "companyId",
  as: "company",
});
Approach.belongsTo(Users, {
  foreignKey: "userId",
  as: "user",
});
Invoice.belongsTo(Clients, {
  foreignKey: "companyId",
  as: "company",
});
Invoice.belongsTo(Users, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  Users,
  Clients,
  Approach,
  Platform,
  Status,
  Invoice,
  Service,
};
