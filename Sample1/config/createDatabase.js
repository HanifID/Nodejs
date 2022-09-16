#!/usr/bin/env node

const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config ({ path: './.env'});

var con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS "+process.env.DATABASE, function (err, result) {
    if (err) throw err;
    console.log("Database created");
    con.end();
  });
});

module.exports = con;

