// Import the mongoose module
const mongoose = require("mongoose");

require("dotenv").config();

const uri = process.env.CONN_STR;

async function connect() {
  await mongoose.connect(uri);
}

module.exports = { connect };
