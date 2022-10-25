const express = require("express");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

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

//UPDATING PASSWORD****************************************
profileRouter.post("/edit-password", isAuthenticated, (req, res, next) => {
  const { password, newPassword, confirmNewPassword, _id } = req.body;

  if (password === "") {
    res.status(400).json({ message: "Provide your current password, please." });
    return;
  }

  if (newPassword === "") {
    res.status(400).json({ message: "Provide your new password, please." });
    return;
  }

  //To confirm the new password
  if (newPassword !== confirmNewPassword) {
    console.log("Password:", newPassword);
    console.log("Confirm Password:", confirmNewPassword);
    res
      .status(400)
      .json({ message: "The new password confirmation doesn't match" });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(newPassword)) {
    res.status(400).json({
      message:
        "New password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  //proceed to hash the new password
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(newPassword, salt);

  User.findOne({ _id }).then((foundUser) => {
    console.log("The user:", foundUser);

    // Compare the provided password with the one saved in the database
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
    console.log("Password is Corret?", passwordCorrect);

    if (passwordCorrect) {
      // Deconstruct the user object to omit the password
      const { _id, email, name } = foundUser;

      User.findByIdAndUpdate(
        _id,
        { password: hashedPassword },
        { new: true }
      ).then((updatedPassword) => {
        // Create an object that will be set as the token payload
        const payload = { _id: _id, email: email, name: name };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.json({ user: updatedPassword, authToken: authToken });
      });
    } else {
      res.status(401).json({ message: "Password wrong!" });
    }
  });
});

// 🗑️ DELETE ACCOUNT ********************

profileRouter.post("/delete-account", isAuthenticated, (req, res, next) => {
  const { _id, password } = req.body;

  if (password === "") {
    res
      .status(400)
      .json({ message: "Provide your password, to confirm your deletion." });
    return;
  }

  User.findById(_id).then((foundUser) => {
    console.log("🗑️ User who want to delete their account: ", foundUser);

    // Compare the provided password with the one saved in the database
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
    console.log("Password is Corret?", passwordCorrect);

    if (passwordCorrect) {
      User.findByIdAndDelete(_id).then(() => {
        const sim = true;

        res.json({ sucesso: sim });
      });
    } else {
      res.status(401).json({ message: "Password wrong!" });
    }
  });
});

module.exports = profileRouter;

// if (passwordCorrect) {
//     // Deconstruct the user object to omit the password
//     const { _id, email, name } = foundUser;

//     User.findByIdAndDelete(_id).then((deleteUser) => {
//       // Create an object that will be set as the token payload
//       const payload = { _id, email, name };

//       // Create a JSON Web Token and sign it
//       const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
//         algorithm: "HS256",
//         expiresIn: "6h",
//       });

//       res.json({ user: deleteUser, authToken: authToken });
//     });
//   } else {
//     res.status(401).json({ message: "Password wrong!" });
//   }
