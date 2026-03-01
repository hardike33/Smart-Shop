const express = require("express");
const mysql = require("mysql");

const app = express();

// Create connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "smartshop" // add your database name
});

// Connect to MySQL
con.connect(function (err) {
  if (err) {
    console.log("Connection Failed:", err);
  } else {
    console.log("MySQL Connected Successfully ✅");
  }
});
