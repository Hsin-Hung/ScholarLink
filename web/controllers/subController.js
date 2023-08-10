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
    console.log(email);
    let interests;
    if (myCache.has(email)) {
      console.log(`cached interests for ${email}`);
      interests = myCache.get(email);
    } else {
      const interests = (await subService.getSubInterests(email)).interests;
      if (!interests) {
        return res.status(400).json({ error: "No interests to fetch" });
      }
      myCache.set(email, interests);
    }
    res.json({ interests: interests, status: "success" });
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
  const val = await validate({
    email: email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: false,
  });
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
    console.log(email);
    console.log(interests);
    if (await validateSubData(email, interests)) {
      const sub = await subService.createSub(email, interests);
      myCache.set(email, interests);
      subService.sendData(email);
      res.json({ status: "success" });
    } else {
      res.status(400).json({ error: "Invalid email or interests" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSub = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const query = await subService.deleteSub(req.body.email);
    if (query.deletedCount == 0) {
      return res.status(400).json({ error: "Invalid email to unsubscribe" });
    }
    myCache.del(email);
    res.json({ status: "success" });
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
