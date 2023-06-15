const express = require("express");
const db = require("./db.js");
const {
  getOptions,
  getSubInterests,
  createSub,
  deleteSub,
  connectRMQ,
  closeRMQ,
} = require("./controllers/subController");
const app = express();
const port = 8080;

const dbConnectPromise = db.connect();
const rmqConnectPromise = connectRMQ();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Display Website");
});

app.post("/subscribe", createSub);

app.post("/unsubscribe", deleteSub);

app.post("/fetch", getSubInterests);

app.get("/options", getOptions);

let server;

Promise.all([dbConnectPromise, rmqConnectPromise])
  .then(() => {
    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to db or rmq");
  });

process.on("SIGTERM", async () => {
  try {
    if (server) {
      await server.close();
    }
    await db.close();
    await closeRMQ();
    console.log("Graceful shutdown complete");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
});
