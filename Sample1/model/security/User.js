const Sequelize = require("sequelize");
const db = require("../../config/config");

const user = db.define(
    "user",
    {
      username: { type: Sequelize.STRING, primaryKey: true, unique: true, allowNull: false, length:50 },
      password: { type: Sequelize.STRING, allowNull: false, length: 100 },
      enabled: { type: Sequelize.INTEGER, allowNull: false },
    },
    {
      freezeTableName: true,
    }
  );
  
  module.exports = user;