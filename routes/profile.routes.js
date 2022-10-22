const express = require("express");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const profileRouter = express.Router();

profileRouter.post("/edit", isAuthenticated, (req, res, next) => {
  const { name, email, _id } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Provide your name, please" });
  }

  if (!email) {
    return res.status(400).json({ message: "Provide email, please." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }
  User.findOne({
    $or: [{ email }, { name }],
    _id: { $ne: _id },
  }).then((foundUser) => {
    console.log("The user:", foundUser);
    if (foundUser) {
      return res.status(400).json({ message: "🤌🤌🤌🤌🤌🤌" });
    }
    User.findByIdAndUpdate(_id, { name, email }, { new: true }).then(
      (updatedUser) => {
        // Create an object that will be set as the token payload
        const payload = { _id: _id, email: email, name: name };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.json({ user: updatedUser, authToken: authToken });
      }
    );
  });
});

module.exports = profileRouter;
