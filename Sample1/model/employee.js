const Sequelize = require("sequelize");
const db = require("../config/config");
const user = require("./security/User");



const employee = db.define(
    "employee",
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING, allowNull: true,  references: {
        model: user,
        key: 'username',
    }
      },
      full_name: { type: Sequelize.STRING, allowNull: false, length: 50 },
      dependant: {type: Sequelize.INTEGER},
      biography: { type: Sequelize.STRING },
      birthdate: { type: Sequelize.DATEONLY},
      hire_date: { type: Sequelize.DATE },
      wear_glasses: { type: Sequelize.BOOLEAN },
      salary: { type: Sequelize.DOUBLE },
    },
    {
      freezeTableName: true,
    }
  );
  
  module.exports = employee;
  