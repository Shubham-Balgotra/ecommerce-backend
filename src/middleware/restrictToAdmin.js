// middleware/restrictToAdmin.js
const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).send({ error: "Admin access required" });
  }
  next();
};
module.exports = restrictToAdmin;