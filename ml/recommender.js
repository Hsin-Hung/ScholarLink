const subService = require("./services/subService");

exports.process = async (email) => {
  const res = await subService.getInterests(email);
  await new Promise((res) => setTimeout(res, 10000));
  await subService.updateRecommendations(email, res.interests);
  console.log("Recommend Done");
};
