const SubModel = require("../models/sub");

exports.getSubInterests = async (email) => {
  return await SubModel.find({ email: email }, "interests");
};

exports.createSub = async (email, interests) => {
  return await SubModel.findOneAndUpdate(
    { email: email },
    { interests: interests },
    { upsert: true, new: true }
  );
};

exports.deleteSub = async (email) => {
  return await BlogModel.deleteOne({ email: email });
};
