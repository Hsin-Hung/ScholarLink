const SubModel = require("../models/sub");
const amqp = require("amqplib/callback_api");

exports.getSubInterests = async (email) => {
  return await SubModel.find({ email: email }, "interests");
};

exports.createSub = async (email, interests) => {
  return await SubModel.findOneAndUpdate(
    { email: email },
    { interests: interests, recommendations: [] },
    { upsert: true, new: true }
  );
};

exports.deleteSub = async (email) => {
  return await SubModel.deleteOne({ email: email });
};

exports.notifyRecSub = (email) => {
  amqp.connect("amqp://rabbitmq", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "task_queue";
      var msg = email;

      channel.assertQueue(queue, {
        durable: true,
      });
      channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true,
      });

      console.log(" [x] Sent %s", msg);
    });
  });
};
