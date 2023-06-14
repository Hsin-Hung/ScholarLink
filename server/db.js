// Import the mongoose module
const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = async () => {
  const uri = process.env.CONN_STR;
  return mongoose.connect(uri);
}
