const SubModel = require("../models/sub");
const amqp = require("amqplib");

exports.getAllRecommendations = async () => {
  try {
    const res = await SubModel.find({}, "email recommendation");
    console.log(res);
    return res;
  } catch (err) {
    console.log(`Fail to get all recommendations ` + err);
    return false;
  }
};

exports.resetRecommendations = async () => {
  try {
    await channel.sendToQueue("task_queue", Buffer.from(""), {
      persistent: true,
      messageId: "resetRecommendations",
    });
  } catch (error) {
    console.log(error);
  }
};

let channel, connection;

exports.connectRMQ = async () => {
  try {
    connection = await amqp.connect("amqp://rabbitmq");
    channel = await connection.createChannel();
    const queue = "task_queue";
    await channel.assertQueue(queue, {
      durable: true,
    });
    return Promise.resolve();
  } catch (error) {
    console.log(error);
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    return Promise.reject(error);
  }
};

exports.closeRMQ = async () => {
  if (channel) {
    await channel.close();
  }
  if (connection) {
    await connection.close();
  }
  console.log("RabbitMQ disconnected through app termination");
};
