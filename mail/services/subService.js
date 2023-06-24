const SubModel = require("../models/sub");
const amqp = require("amqplib");

exports.getAllRecommendations = async () => {
  try {
    const res = await SubModel.find(
      {},
      { email: 1, recommendation: 1, _id: 0 }
    );
    console.log(res);
    return res;
  } catch (err) {
    console.log(`Fail to get all recommendations ` + err);
    return false;
  }
};

// send reset recommendations task to work queue for the recommender to process
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

// connect to work queue
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

// close work queue
exports.closeRMQ = async () => {
  if (channel) {
    await channel.close();
  }
  if (connection) {
    await connection.close();
  }
  console.log("RabbitMQ disconnected through app termination");
};
