const mongoose = require("mongoose");

const connectDB = async () => {
    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    }catch(error){
        console.log("Mongo Db is not connected ")
    }
};

module.exports = connectDB;
