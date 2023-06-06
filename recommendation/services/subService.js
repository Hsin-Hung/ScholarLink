const SubModel = require("../models/sub");

exports.updateRecommendations = async (email, recommendations) => {
  try {
    const res = await SubModel.updateOne(
      { email: email },
      { recommendations: recommendations }
    );
    console.log(res);
  } catch (err) {
    console.log(`Fail to update recommendation for email ${email}`);
  }
};
