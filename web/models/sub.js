const { Schema, model } = require("mongoose");

const subSchema = new Schema({
  email: String,
  interests: [String],
  recommendation: String,
});

module.exports = model("Sub", subSchema);
