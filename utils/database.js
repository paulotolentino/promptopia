import mongoose from "mongoose";

let isConnected = false; // Database connection initial status

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("using existing database");
    return;
  }

  try {

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB,
      useNewUrlParser: true,
    });

    isConnected = true;

    console.log("new database connection");

  } catch (error) {
    console.error(error);
  }
}