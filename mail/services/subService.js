const SubModel = require("../models/sub");
const amqp = require("amqplib");

exports.getAllRecommendations = async () => {
  try {
    const res = await SubModel.find({}, "email recommendation");
    console.log(res);
    return res;
  } catch (err) {
    console.log(`Fail to get all recommendations ` + err);
    return null;
  }
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

exports.resetRecommendations = async () => {
  const content = "";
  await channel.sendToQueue("task_queue", Buffer.from(content), {
    persistent: true,
  });
};
