const subService = require("./services/subService");

exports.process = async (email) => {
  const recommendations = ["abc.com", "123.com"];
  await new Promise((res) => setTimeout(res, 10000));
  await subService.updateRecommendations(email, recommendations);
  console.log("Recommend Done");
};
