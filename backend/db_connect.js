const mongoose = require("mongoose");

const db = process.env.DATABASE_CONNECTION_STRING.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

const dbConnection = async () => {
  try {
    await mongoose.connect(db);
    console.log("db connection successful...!!!");
  } catch (e) {
    console.log("db connection is failed", e);
    process.exit(1);
  }
};

module.exports = dbConnection;
