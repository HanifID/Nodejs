const express = require('express');
const router = express.Router();
const apiCar = require('../../controller/carController');
const apiEmp = require('../../controller/employeeController');


router.route("/car")
.get(apiCar.getCars)
.post(apiCar.addCar)
.delete(apiCar.deleteCar)
.put(apiCar.updateCar);

router.route("/car/:id")
.get(apiCar.getCar)

router.route("/employeeName")
.get(apiEmp.getEmployeeName);

router.route("/employees")
.get(apiEmp.getEmployees);

module.exports = router;
