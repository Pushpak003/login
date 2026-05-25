const express = require("express");

const {
  register,
  login,resetPassword
} = require("../controller/authcontroller");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/reset-password", resetPassword);

module.exports = router;