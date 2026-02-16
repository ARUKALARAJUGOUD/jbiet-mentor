const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const env = require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))


// deploying 
const helmet = require("helmet");
const compression = require("compression");

app.use(helmet());
app.use(compression());

app.use(cors({
  origin: [
    "http://localhost:3001",
    // "http://192.168.1.150:3000"
"https://jbiet-mentor.onrender.com"
  ],

  credentials: true
}));

//Authentication 
app.use("/auth", require("./routes/authRoutes"));

app.use("/student/attendance",require("./routes/attendance"));

app.use("/admin",require("./routes/admin"));
app.use("/subjects", require("./routes/subjectRoutes"));


app.use("/topper", require("./routes/topperRoutes"));

//student dashboard 
app.use("/students",require("./routes/studentRoutes"));

// app.use("/delete-data",require("./routes/DeleteDataRoutes"))
app.use("/data",require("./routes/DeleteAndGetDataRoutes"));

// deploying 

const path = require("path");
// Serve static files
app.use(express.static(path.join(__dirname, "../client/build")));

// Catch all handler (React routing support)
app.use("*",(req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});





connectDB()

// app.listen(5000, "0.0.0.0", () => console.log("Server running"));

const PORT =  process.env.PORT || 5000;
// process.env.PORT || process.env.PORT || 

app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`);
});


  