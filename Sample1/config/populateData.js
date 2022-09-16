#!/usr/bin/env node

const user = require("../model/security/User");
const emp = require("../model/employee");
const car = require("../model/Car");

var users =  () => {
     user.bulkCreate([
        {username: "admin", password: "$2a$12$gs8I3Waiz1tyWHmgCbjkJeeFVNdPe9cgnWmR6XfL.QlgomEECglmS", enabled: true },
        {username: "user", password: "$2a$12$gs8I3Waiz1tyWHmgCbjkJeeFVNdPe9cgnWmR6XfL.QlgomEECglmS", enabled: true },
        {username: "Soekarno", password: "$2a$12$gs8I3Waiz1tyWHmgCbjkJeeFVNdPe9cgnWmR6XfL.QlgomEECglmS", enabled: true },
        {username: "Hatta", password: "$2a$12$gs8I3Waiz1tyWHmgCbjkJeeFVNdPe9cgnWmR6XfL.QlgomEECglmS", enabled: true },
        {username: "Soharto", password: "$2a$12$gs8I3Waiz1tyWHmgCbjkJeeFVNdPe9cgnWmR6XfL.QlgomEECglmS", enabled: true }
    ] );
};

var employees = async () => {
     emp.bulkCreate([
        {username: "admin", full_name: "Administrator", dependant: "", biography: "admin",  birthdate: "1980-09-22", hire_date: "2020-09-22 10:09:49", wear_glasses: true, salary: 0},
        {username: "user", full_name: "User", dependant: "", biography: "user",  birthdate: "1980-09-22", hire_date: "2020-09-22 10:09:49", wear_glasses: true, salary: 0},
        {full_name: "Soekarno", dependant: "", biography: "First",  birthdate: "1980-09-22", hire_date: "2020-09-22 10:09:49", wear_glasses: false, salary: 25000},
        {full_name: "Hatta", dependant: "", biography: "First",  birthdate: "1982-09-22", hire_date: "2020-09-22 10:09:49", wear_glasses: true, salary: 21000},
        {full_name: "Soeharto", dependant: "", biography: "First",  birthdate: "1984-09-22", hire_date: "2020-09-22 10:09:49", wear_glasses: false, salary: 30000}
    ]);

};

var cars =  () => {
    for (i= 1; i< 1000 ; i++) {
         car.create({ name: "Car "+i, brand: "Car",  year: 1999, owner: 1});
    }
};

users();
employees();
cars();

module.exports = {users, employees, cars};