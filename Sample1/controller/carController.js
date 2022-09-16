const { Op, col } = require("sequelize");
const car = require("../model/Car");


const getCars = async (req, res, next) => {
  try {

    var draw = req.query.draw;
    var start = req.query.start;
    var length = req.query.length;
    var order_data = req.query.order;

    length = parseInt(length);
    start = parseInt(start);
    var getAllCar = null;

    var column_index = req.query.order[0]['column'];
    var column_length = req.query.columns.length;

    if (column_index < column_length - 1) {
      var column_name = req.query.columns[column_index]['data'];
      var column_sort_order = req.query.order[0]['dir'];
    } else {
      var column_name = 'id';
      var column_sort_order = 'asc';
    }

    //  console.log(req.query.columns[column_index]['data']);
    //  console.log(column_length, column_index,column_name, column_sort_order);

    if (req.query.search.value.length > 0) {
      const search = req.query.search.value;
      console.log(search);
      getAllCar = await car.findAndCountAll({
        where: {
          name: {
            [Op.substring]: search
          }
        },
        offset: start, limit: length
      })
    } else {
      getAllCar = await car.findAndCountAll({
        order: [
          [column_name, column_sort_order]
        ],
        offset: start, limit: length
      });
    }


    var output = {
      'draw': draw,
      'data': getAllCar.rows,
      'iTotalDisplayRecords': getAllCar.count,
      'iTotalRecords': getAllCar.count
    };
    res.json(output);
  } catch (err) {
    console.error(err.messsage);
    res.status(500).send(err.messsage);
  }
};

const addCar = (req, res) => {
  try {
    const { name, brand, year, owner } = req.body;

    const newCar = new car({
      name,
      brand,
      year,
      owner,
    });

    newCar.save();
    res.json(newCar);
  } catch (err) {
    console.log(err.messsage);
    res.status(500).send("server error");
  }
};

const deleteCar = async (req, res) => {
  try {
    const { id } = req.body;

    const deleteCar =  await car.destroy({
      where: {id: id}
    })

    res.json("success: data deleted");

  } catch (err) {
    console.log(err.messsage);
    res.status(500).send("server error");
  }
};



const updateCar =  (req, res) => {
  try {
    const { id, name, brand, year, owner } = req.body;

    const updateCar =  car.update({
      name : name,
      brand: brand,
      year: year,
      owner: owner
    }, 
    {
      where: {
        id: id
      }
    });

    res.json("success: data updated");
  } catch (err) {
    console.log(err.messsage);
    res.status(500).send("server error");
  }
};

const getCar = async (req, res) => {
  try {

    const  id = req.params.id;

    let getCar = await car.findOne({
        where: {
          id: id
        }
    });

    var output = {
      'data': getCar,
    };

    res.json(output);
  } catch (err) {
    console.error(err.messsage);
    res.status(500).send(err.messsage);
  }
};

module.exports = { getCar, getCars, addCar , deleteCar, updateCar};
