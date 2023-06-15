const subService = require("../services/subService");
const allInterests = require("../constants/interests.js");

exports.getOptions = async (req, res) => {
  let content = [];
  for (let i = 0; i < allInterests.length; i++) {
    content.push({ value: allInterests[i], label: allInterests[i] });
  }
  res.json({ options: content, status: "success" });
};

exports.getSubInterests = async (req, res) => {
  try {
    const interests = await subService.getSubInterests(req.body.email);
    res.json({ data: interests, status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.createSub = async (req, res) => {
  try {
    const sub = await subService.createSub(req.body.email, req.body.interests);
    subService.sendData(req.body.email);
    res.json({ data: sub, status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSub = async (req, res) => {
  try {
    const sub = await subService.deleteSub(req.body.email);
    res.json({ data: sub, status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.connectRMQ = async () => {
  return subService.connectQueue();
};

exports.closeRMQ = async () => {
  return subService.closeQueue();
};
