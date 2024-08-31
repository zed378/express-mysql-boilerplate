const { Clients } = require("./client");
const { Status } = require("./status");
const { Platform } = require("./platform");
const { Approach } = require("./approach");
const { Users } = require("./user");
const { Invoice } = require("./invoice");
const { Service } = require("./service");
const { Categories } = require("./category");
const { Products } = require("./product");
const { ProductCategories } = require("./product_category");
const { Ratings } = require("./rating");

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

// product and category
Products.belongsToMany(Categories, {
  through: ProductCategories,
  as: "categories",
  foreignKey: "productId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Categories.belongsToMany(Products, {
  through: ProductCategories,
  as: "products",
  foreignKey: "categoryId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// Product Rating
Users.hasMany(Ratings, { foreignKey: "userId" });
Products.hasMany(Ratings, { foreignKey: "productId" });
Ratings.belongsTo(Users, { foreignKey: "userId" });
Ratings.belongsTo(Products, { foreignKey: "productId" });

module.exports = {
  Users,
  Clients,
  Approach,
  Platform,
  Status,
  Invoice,
  Service,
  Categories,
  Products,
  ProductCategories,
  Ratings,
};
