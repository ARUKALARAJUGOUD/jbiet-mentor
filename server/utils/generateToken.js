
const jwt = require("jsonwebtoken");

exports.accessToken = (user) => {
 return jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: "1d" }
);
};

exports.refreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};
