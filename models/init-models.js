var DataTypes = require("sequelize").DataTypes;
var _categories = require("./categories");
var _products = require("./products");
var _session = require("./session");
var _user = require("./user");

function initModels(sequelize) {
  var categories = _categories(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var session = _session(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  products.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(products, { as: "products", foreignKey: "category_id"});
  session.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(session, { as: "sessions", foreignKey: "user_id"});

  return {
    categories,
    products,
    session,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
