const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const db = require("./db.js");
const {
  getOptions,
  getSubInterests,
  createSub,
  deleteSub,
  connectRMQ,
  closeRMQ,
} = require("./controllers/subController");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
const port = 8080;

const dbConnectPromise = db.connect();
const rmqConnectPromise = connectRMQ();

app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(express.static("client/build"));

// get the client react page
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// users subscribe with their emails and interests
app.post("/subscribe", createSub);

// users unsubscribe with their emails
app.post("/unsubscribe", deleteSub);

// users fetch their previous interests
app.post("/fetch", getSubInterests);

// get the interest options for client react page
app.get("/options", getOptions);

let server;

Promise.all([dbConnectPromise, rmqConnectPromise])
  .then(() => {
    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
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
