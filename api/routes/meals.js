const express = require("express");
const Meals = require("../models/Meals");

const router = express.Router();
const { isAuthenticated, hasRoles } = require("../auth");
 
router.get("/",isAuthenticated, (req, res) => {
  Meals.find()
    .exec()
    .then((x) => res.status(200).send(x));
});

router.get("/:id",isAuthenticated, (req, res) => {
  Meals.findById(req.params.id)
    .exec()
    .then((x) => res.status(200).send(x));
});

router.post("/", (req, res) => {
  Meals.create(req.body).then((x) => res.status(201).send(x));
});

router.put("/:id", (req, res) => {
  Meals.findByIdAndUpdate(req.params.id, req.body).then((x) =>
    res.status(204).send(x)
  );
});

router.delete("/:id", (req, res) => {
  Meals.findOneAndDelete(req.params.id)
    .exec()
    .then(() => res.sendStatus(204));
});

module.exports = router;
