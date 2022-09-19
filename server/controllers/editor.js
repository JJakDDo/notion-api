let cachedWriting = {};

const updateWriting = async (req, res) => {
  cachedWriting = req.body;
  res.status(200).json({ msg: "success" });
};

const getWriting = async (req, res) => {
  res.status(200).json(cachedWriting);
};

module.exports = {
  updateWriting,
  getWriting,
};
