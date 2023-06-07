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

exports.getInterests = async (email) => {
  try {
    const res = await SubModel.findOne({ email: email }, "interests");
    console.log(res);
    return res;
  } catch (err) {
    console.log(`Fail to get interests for email ${email}`);
    return null;
  }
};
