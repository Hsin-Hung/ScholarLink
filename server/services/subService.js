const SubModel = require("../models/sub");
const amqp = require("amqplib");

exports.getSubInterests = async (email) => {
  return await SubModel.find({ email: email }, "interests");
};

exports.createSub = async (email, interests) => {
  return await SubModel.findOneAndUpdate(
    { email: email },
    { interests: interests, recommendation: "", hasRecommended: true },
    { upsert: true, new: true }
  );
};

exports.deleteSub = async (email) => {
  return await SubModel.deleteOne({ email: email });
};

let channel, connection;

exports.connectQueue = async () => {
  try {
    connection = await amqp.connect("amqp://rabbitmq");
    channel = await connection.createChannel();
    var queue = "task_queue";
    await channel.assertQueue(queue, {
      durable: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.sendData = async (email) => {
  await channel.sendToQueue("task_queue", Buffer.from(email), {
    persistent: true,
  });
};
