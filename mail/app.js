const db = require("./db.js");
const nodemailer = require("nodemailer");
const {
  getAllRecommendations,
  resetRecommendations,
  connectRMQ,
  closeRMQ,
} = require("./services/subService");
let cron = require("node-cron");

const dbConnectPromise = db.connect();
const rmqConnectPromise = connectRMQ();

const sendEmail = async (email, recommendation) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "scholarlinkmail@gmail.com", // sender address
      to: email, // receiver
      subject: "Your Weekly Research Paper", // Subject line
      text: recommendation, // plain text body
      html: "<a href=" + recommendation + ">Your weekly research paper</a>", // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.log(err);
  }
};

const sendEmails = async () => {
  console.log("Start sending emails ...");
  const res = await getAllRecommendations();
  if (res) {
    for (let i = 0; i < res.length; i++) {
      let email = res[i].email;
      let recommendation = res[i].recommendation;
      if (recommendation) {
        await sendEmail(email, recommendation);
      } else {
        console.log(email + " has no recommendation to send");
      }
    }
    resetRecommendations();
  }
};

let task;

Promise.all([dbConnectPromise, rmqConnectPromise])
  .then(() => {
    task = cron.schedule("*/30 * * * * *", sendEmails);
    task.start();
  })
  .catch((err) => {
    console.log("Error connecting to db or rmq");
  });

process.on("SIGTERM", async () => {
  try {
    if (task) {
      task.stop();
    }
    await db.close();
    await closeRMQ();
    console.log("Graceful shutdown complete");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
});
