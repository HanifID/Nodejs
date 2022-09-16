const sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config ({ path: './.env'});

const db = new sequelize( process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: "mysql",
});

db.sync({});

module.exports = db;
