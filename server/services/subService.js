const SubModel = require("../models/sub");
const OptionsModel = require("../models/options");
const NodeCache = require("node-cache");
const amqp = require("amqplib");

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

exports.getSubInterests = async (email) => {
  if (myCache.has(email)) {
    console.log(`cached interests for ${email}`);
    return myCache.get(email);
  } else {
    const res = await SubModel.find({ email: email }, "interests");
    myCache.set(email, res);
    return res;
  }
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
  if (myCache.has("options")) {
    console.log("cached options");
    return myCache.get("options");
  } else {
    const res = await OptionsModel.findOne({}, "values");
    myCache.set("options", res, 0);
    return res;
  }
};

let channel, connection;

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

exports.closeQueue = async () => {
  if (channel) {
    await channel.close();
  }
  if (connection) {
    await connection.close();
  }
  console.log("RabbitMQ disconnected through app termination");
};

exports.sendData = async (email) => {
  await channel.sendToQueue("task_queue", Buffer.from(email), {
    persistent: true,
    messageId: "newSubscriber",
  });
};
