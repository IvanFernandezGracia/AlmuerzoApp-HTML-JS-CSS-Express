const { send } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

const isAuthenticated = (req, res, next) => {
  const token = req.headers.autorization;
  if (!token) {
    return res.sendStatus(403);
  }
  jwt.verify(token, "misecreto", (err, decoded) => {
    if (err) {
      return res.send(err);
    }
    const { _id } = decoded;
    Users.findOne({ _id })
      .exec()
      .then((user) => {
        req.user = user;
        next();
      });
  });
};

const hasRoles = (roles) => (req, res, next) => {
  if (roles.indexOf(req.user.role) > -1) {
    return next();
  }

  res
    .status(403)
    .send(`El rol ${req.user.role} no esta permitido, solo roles ${roles}`);
};
module.exports = { isAuthenticated, hasRoles };
