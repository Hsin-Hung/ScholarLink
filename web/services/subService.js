const SubModel = require("../models/sub");
const OptionsModel = require("../models/options");
const amqp = require("amqplib");

exports.getSubInterests = async (email) => {
  return await SubModel.find({ email: email }, { interests: 1, _id: 0 });
};

exports.createSub = async (email, interests) => {
  return await SubModel.findOneAndUpdate(
    { email: email },
    { interests: interests, recommendation: "https://www.springer.com/us" },
    { upsert: true, new: true }
  );
};

exports.deleteSub = async (email) => {
  return await SubModel.deleteOne({ email: email });
};

exports.getOptions = async () => {
  return await OptionsModel.findOne({}, { values: 1, _id: 0 });
};

let channel, connection;

// connect to work queue
exports.connectQueue = async () => {
  try {
    connection = await amqp.connect("amqp://rabbitmq");
    channel = await connection.createChannel();
    const queue = "task_queue";
    await channel.assertQueue(queue, {
      durable: true,
    });
    return Promise.resolve();
  } catch (error) {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    return Promise.reject(error);
  }
};

// close to work queue
exports.closeQueue = async () => {
  if (channel) {
    await channel.close();
  }
  if (connection) {
    await connection.close();
  }
  console.log("RabbitMQ disconnected through app termination");
};

// send new task to work queue for the recommender to process
exports.sendData = async (email) => {
  await channel.sendToQueue("task_queue", Buffer.from(email), {
    persistent: true,
    messageId: "newSubscriber",
  });
};
