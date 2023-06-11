const subService = require("../services/subService");

exports.getSubInterests = async (req, res) => {
  try {
    const interests = await subService.getSubInterests(req.body.email);
    res.json({ data: interests, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSub = async (req, res) => {
  try {
    const sub = await subService.createSub(req.body.email, req.body.interests);
    subService.sendData(req.body.email);
    res.json({ data: sub, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSub = async (req, res) => {
  try {
    const sub = await subService.deleteSub(req.body.email);
    res.json({ data: sub, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.initConnection = async () => {
  await subService.connectQueue();
};
