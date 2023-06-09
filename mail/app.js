const db = require("./db.js");
const subService = require("./services/subService");
const https = require("https");

db.connect().catch((err) => console.log(err));

const getArticles = async () => {
  res = await subService.getAllRecommendations();
  recommendations = res[0].recommendations;
  console.log(recommendations);
  const doi = recommendations[0];
  const api_key = process.env.API_KEY;
  const url =
    "https://api.springernature.com/openaccess/json?q=" +
    doi +
    "&api_key=" +
    api_key;

  https
    .get(url, (res) => {
      let data = [];
      console.log("statusCode:", res.statusCode);
      console.log("headers:", res.headers);

      res.on("data", (chunk) => {
        data.push(chunk);
      });

      res.on("end", () => {
        console.log("Response ended: ");
        const users = JSON.parse(Buffer.concat(data).toString());
        console.log(users);
      });
    })
    .on("error", (err) => {
      console.log("Error: ", err.message);
    });
};

getArticles();
