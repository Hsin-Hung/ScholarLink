const express = require("express");
const db = require("./db.js");
const {
  getSubInterests,
  createSub,
  deleteSub,
} = require("./controllers/subController");
const app = express();
const port = 3000;

db.connect().catch((err) => console.log(err));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Display Web");
});

app.post("/subscribe", createSub);

app.post("/unsubscribe", deleteSub);

app.post("/fetch", getSubInterests);

app.get("/options", (req, res) => {
  res.json({
    options: [
      { value: "chocolate", label: "Chocolate" },
      { value: "strawberry", label: "Strawberry" },
      { value: "vanilla", label: "Vanilla" },
    ],
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
