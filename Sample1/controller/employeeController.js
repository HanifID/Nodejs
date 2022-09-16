const { Op } = require("sequelize");
const emp = require("../model/Employee");


const getEmployeeName = async (req, res) => {
  try {
    var getEmpName = await emp.findAll({
        attributes: ['id', 'username', 'full_name']
    });

    var output = {
      'data': getEmpName,
    };

    res.json(output);
  } catch (err) {
    console.error(err.messsage);
    res.status(500).send(err.messsage);
  }
};


const getEmployees = async (req, res, next) => {
  try {
    var getAllEmp = null;

    if (req.query.search.value.length > 0) {
      const search = req.query.search.value;
      console.log(search);
      getAllEmp = await emp.findAndCountAll({
        where: {
          full_name: {
            [Op.substring]: search
          }
        }
      })
    } else {
      getAllEmp = await emp.findAndCountAll({});
    }

    var output = {
      'draw': req.query.draw,
      'data': getAllEmp.rows,
      'iTotalDisplayRecords': getAllEmp.count,
      'iTotalRecords': getAllEmp.count
    };
    res.json(output);
    } catch (err) {
      console.error(err.messsage);
      res.status(500).send(err.messsage);
    }
  };



module.exports = { getEmployeeName, getEmployees };
