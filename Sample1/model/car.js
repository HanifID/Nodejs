const Sequelize = require("sequelize");
const db = require("../config/config");
const employee = require("./Employee");

const car = db.define(
  "car",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false },
    brand: { type: Sequelize.STRING, allowNull: false },
    year: {type: Sequelize.INTEGER},
    owner: { type: Sequelize.INTEGER, references: {
        model: employee,
        key: 'id',
    }
 },
  },
  {
    freezeTableName: true,
  }
);

module.exports = car;
