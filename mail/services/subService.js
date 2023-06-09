const SubModel = require("../models/sub");
const amqp = require("amqplib/callback_api");

exports.getAllRecommendations = async () => {
  try {
    const res = await SubModel.find({}, "email recommendations");
    console.log(res);
    return res;
  } catch (err) {
    console.log(`Fail to get all recommendations`);
    return null;
  }
};
