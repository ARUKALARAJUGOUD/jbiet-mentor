const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const API = process.env.REACT_APP_API_URL;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

app.use(cors({
  origin: [{API}],
  credentials: true
}));
// "http://localhost:3000"]
 


mongoose.connect("mongodb+srv://arukalaraju13_db_user:YZSoEpZwx9EBIGiU@cluster0.c6krizy.mongodb.net/collegeAuth");

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await User.create({
    name: "RAJU GOUD",
    email: "admin@college.com",
    facultyId: "456456456",
    password: hashedPassword,
    role: "admin"
  });

  console.log("✅ Super Admin Created");
  process.exit();
}
//  run the code 
// node createSuperAdmin.js 
createAdmin();
