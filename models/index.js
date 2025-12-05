'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/* ============================================
  ANCIEN CODE À RETIRER : parcours automatique des fichiers
  fs.readdirSync(__dirname)...
  Object.keys(db).forEach(modelName)...
============================================ */
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

/* ============================================
  NOUVEAU CODE À AJOUTER : utiliser initModels
============================================ */
const initModels = require('./init-models'); // <-- chemin vers ton init-models.js
const models = initModels(sequelize);

db.categories = models.categories;
db.products = models.products;

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = models.user;      
db.session = models.session; 

module.exports = db;
