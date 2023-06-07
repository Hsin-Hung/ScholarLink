// Import the mongoose module
const mongoose = require("mongoose");
const Sub = require("./models/sub");

require("dotenv").config();

const uri = process.env.ATLAS_URI;

async function connect() {
  await mongoose.connect(uri);
}

module.exports = { connect };
