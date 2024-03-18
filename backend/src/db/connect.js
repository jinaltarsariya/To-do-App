// external modules import
const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://Jinal:JinalDeveloper@cluster0.qucu8eb.mongodb.net/toDoApp"
      )
      .then(() => {
        console.log("Connected to MongoDB database successfully.");
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB: ", error.message);
      });
  } catch (error) {
    console.log("Database connection error: ", error.message);
  }
};

module.exports = connectDatabase;
