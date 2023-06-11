const db = require("./db.js");
const nodemailer = require("nodemailer");
const subService = require("./services/subService");
var cron = require("node-cron");

db.connect().catch((err) => console.log(err));
subService.connectQueue();

const sendEmail = async (email, recommendation) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "sallie.schmidt@ethereal.email",
      pass: "cd1xG9D3yMt7BaeqZ1",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: recommendation, // plain text body
    html: "<a href=" + recommendation + ">Your weekly research paper</a>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

const sendEmails = async () => {
  console.log("Start sending emails ...");
  res = await subService.getAllRecommendations();
  for (let i = 0; i < res.length; i++) {
    email = res[i].email;
    recommendation = res[i].recommendation;
    sendEmail(email, recommendation);
  }
  subService.resetRecommendations();
};

let task = cron.schedule("*/30 * * * * *", sendEmails);

task.start();
