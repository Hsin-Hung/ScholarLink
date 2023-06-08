const amqp = require("amqplib/callback_api");
const db = require("./db.js");
const recommender = require("./recommender.js");

db.connect().catch((err) => console.log(err));

amqp.connect("amqp://rabbitmq?heartbeat=60", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = "task_queue";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      function (msg) {
        console.log(" [x] Received %s", msg.content.toString());

        recommender
          .process(msg.content.toString())
          .then(() => {
            channel.ack(msg);
          })
          .catch(() => {
            channel.nack(msg);
          });
      },
      {
        // manual acknowledgment mode,
        // see ../confirms.html for details
        noAck: false,
      }
    );
  });
});
