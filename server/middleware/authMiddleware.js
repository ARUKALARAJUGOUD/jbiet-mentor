
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) return res.sendStatus(401);

    req.user = user;

    console.log("AUTH USER:", req.user.role); // MUST be "admin"
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
