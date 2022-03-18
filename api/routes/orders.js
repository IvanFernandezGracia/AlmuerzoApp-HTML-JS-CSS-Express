const express = require("express");
const { isAuthenticated, hasRoles } = require("../auth");
const router = express.Router();
const Orders = require("../models/Orders");

router.get("/",isAuthenticated, (req, res) => {
  Orders.find()
    .exec()
    .then((x) => res.status(200).send(x));
});

router.get("/:id",isAuthenticated, (req, res) => {
  Orders.findById(req.params.id)
    .exec()
    .then((x) => res.status(200).send(x));
});

router.post("/", isAuthenticated, hasRoles(["admin"]), (req, res) => {
  const { _id } = req.user;
  const { meal_id } = req.body;
  Orders.create({ meal_id, user_id: _id }).then((x) => res.status(201).send(x));
});

router.put("/:id", isAuthenticated, hasRoles(["admin", "user"]), (req, res) => {
  //console.log(req.params.id, req.body);
  Orders.findByIdAndUpdate(req.params.id, req.body)
    .then((x) => res.status(204).send(x))
    .catch((err) => res.status(404).send("error: " + err));
});

router.delete("/:id", isAuthenticated, (req, res) => {
  Orders.findOneAndDelete(req.params.id)
    .exec()
    .then(() => res.sendStatus(204));
});

module.exports = router;
