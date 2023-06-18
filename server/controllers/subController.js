const subService = require("../services/subService");
const { validate } = require("deep-email-validator");
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

exports.getOptions = async (req, res) => {
  try {
    let content = await getOptionsCache();
    res.json({ options: [...content], status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSubInterests = async (req, res) => {
  try {
    const email = req.body.email;
    let interests;
    if (myCache.has(email)) {
      console.log(`cached interests for ${email}`);
      interests = myCache.get(email);
    } else {
      interests = await subService.getSubInterests(email);
      myCache.set(email, interests);
    }
    res.json({ data: interests, status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getOptionsCache = async () => {
  let content;
  if (myCache.has("options")) {
    console.log("cached options");
    content = myCache.get("options");
  } else {
    const options = await subService.getOptions();
    content = new Set(options.values);
    myCache.set("options", content, 0);
  }
  return content;
};

const validateSubData = async (email, interests) => {
  const val = await validate(email);
  // email is not valid or interests are empty
  if (!val["valid"] || interests.length == 0) {
    return false;
  }
  const options = await getOptionsCache();
  // check if all interests exist
  for (let i of interests) {
    if (!options.has(i)) {
      return false;
    }
  }
  return true;
};

exports.createSub = async (req, res) => {
  try {
    const email = req.body.email;
    const interests = req.body.interests;
    if (await validateSubData(email, interests)) {
      const sub = await subService.createSub(email, interests);
      myCache.set(email, interests);
      subService.sendData(email);
      res.json({ data: sub, status: "success" });
    } else {
      res.status(400).json({ error: "Invalid Email or Interests" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSub = async (req, res) => {
  try {
    const email = req.body.email;
    const sub = await subService.deleteSub(req.body.email);
    myCache.del(email);
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
