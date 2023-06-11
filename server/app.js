const express = require("express");
const db = require("./db.js");
const {
  getSubInterests,
  createSub,
  deleteSub,
  initConnection,
} = require("./controllers/subController");
const app = express();
const port = 8080;

db.connect().catch((err) => console.log(err));
initConnection();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Display Website");
});

app.post("/subscribe", createSub);

app.post("/unsubscribe", deleteSub);

app.post("/fetch", getSubInterests);

app.get("/options", (req, res) => {
  res.json({
    options: [
      { value: "Astronomy", label: "Astronomy" },
      { value: "BehavioralSciences", label: "Behavioral Sciences" },
      { value: "vanilla", label: "Vanilla" },
    ],
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
