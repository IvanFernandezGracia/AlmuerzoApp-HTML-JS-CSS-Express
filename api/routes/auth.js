const express = require("express");
const Users = require("../models/Users");
const crypto = require("crypto");
const { send } = require("process");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../auth");

const signToken = (_id) => {
  return jwt.sign({ _id }, "misecreto", { expiresIn: 60 * 60 * 24 * 365 });
};

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  crypto.randomBytes(16, (err, salt) => {
    const newSalt = salt.toString("base64");
    crypto.pbkdf2(password, newSalt, 1000, 64, "sha1", (err, key) => {
      const encryptedPassword = key.toString("base64");
      Users.findOne({ email })
        .exec()
        .then((user) => {
          if (user) {
            return res.send("usuario ya existe");
          }
          Users.create({
            email,
            password: encryptedPassword,
            salt: newSalt,
          }).then(() => {
            res.send("usuario Registrado con exito!");
          });
        });
    });
  });
});
router.post("/login", (req, res) => {
  //console.log("login");
  const { email, password } = req.body;
  Users.findOne({ email })
    .exec()
    .then((user) => {
      //console.log(user);
      if (!user) {
        return res.send("usuario y/o contraseña incorrectaaaa");
      }
      crypto.pbkdf2(password, user.salt, 1000, 64, "sha1", (err, key) => {
        const encryptedPassword = key.toString("base64");
        if (user.password === encryptedPassword) {
          const token = signToken(user._id);
          //console.log(token);
          return res.send({ token });

          // return res.send('Contraseñas coinciden! te dare un token de aceso');
        }
        return res.send("usuario y/o contraseña incorrecta");
      });
    })
    .catch((err) => {
      //console.log(err);

      res.send("errr: " + err);
    });
});

router.get("/me", isAuthenticated, (req, res) => {
  res.send(req.user);
});

module.exports = router;
