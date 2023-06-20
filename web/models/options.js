const { Schema, model } = require("mongoose");

const optionsSchema = new Schema({
  values: [String],
});

module.exports = model("Options", optionsSchema);
