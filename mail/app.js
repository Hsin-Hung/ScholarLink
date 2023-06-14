const db = require("./db.js");
const nodemailer = require("nodemailer");
const subService = require("./services/subService");
var cron = require("node-cron");

const dbConnectPromise = db.connect();
const rmqConnectPromise = subService.connectRMQ();

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

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: email, // sender address
    to: email, // list of receivers
    subject: "Your Weekly Research Paper", // Subject line
    text: recommendation, // plain text body
    html: "<a href=" + recommendation + ">Your weekly research paper</a>", // html body
  });

  console.log("Message sent: %s", info.messageId);
};

const sendEmails = async () => {
  console.log("Start sending emails ...");
  res = await subService.getAllRecommendations();
  if (res) {
    for (let i = 0; i < res.length; i++) {
      email = res[i].email;
      recommendation = res[i].recommendation;
      await sendEmail(email, recommendation);
    }
    subService.resetRecommendations();
  }
};

Promise.all([dbConnectPromise, rmqConnectPromise])
  .then(() => {
    let task = cron.schedule("*/30 * * * * *", sendEmails);
    task.start();
  })
  .catch((err) => {
    console.log("Error connecting to db or rmq");
  });
