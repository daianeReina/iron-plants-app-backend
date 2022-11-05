const { Router } = require("express");

const listPlantRouter = Router();

const { Plant } = require("../models/Plant.model");

const { User } = require("../models/User.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const jwt = require("jsonwebtoken");
const isLoggedIn = require("../middleware/isLoggedIn");

listPlantRouter.get("/", (req, res, next) => {
  res.json({ hi: "working.." });
});

listPlantRouter.post("/add-plant", isLoggedIn, (req, res, next) => {
  const { latin, common, category } = req.body;
  console.log("Latin Name:", latin);

  console.log(req.user);

  //   User.findOne(_id)
  //     .then(() => {
  //       console.log("the user:", foundUser);

  //       //   const payload = { _id: _id, email: email, name: name };

  //       //   const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
  //       //     algorithm: "HS256",
  //       //     expiresIn: "6h",
  //       //   });
  //       res.json({ sucesso: sim });
  //     })
  //     .catch((err) => next(err));

  //   console.log("User ID:", user);

  //Validate if the user doesn't have the same plant

  Plant.findOne({ owner: req.user._id, latin }).then((possiblePlant) => {
    if (possiblePlant) {
      return res
        .status(400)
        .json({ errorMessage: "This plant already exists in your list" });
    }

    Plant.create({ latin, common, category, owner: req.user._id }).then(
      (createdPlant) => {
        // Create an object that will be set as the token payload
        const payload = { latin, common, category };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.json({ createdPlant: createdPlant, authToken: authToken });
      }
    );
  });
});

module.exports = listPlantRouter;

// listPlantRouter.post("/add-plant", isAuthenticated, (req, res) => {
//     const { latin, common, category } = req.body;

//     User.findOne({_id})
//     .then((foundUser) => {
//       req.user = foundUser;
//       console.log("The user:", foundUser);
//       if (!foundUser) {
//           res.status(400).json({ message: "No user." });
//           return;
//         }

//         return Plant.create({ latin, common, category, owner: req.user._id }).then(
//           (addPlant) => res.json({ addPlant: addPlant, authToken: authToken })
//         );
//       const { _id, email, name } = foundUser;

//       // Create an object that will be set as the token payload
//       const payload = { _id: _id };

//       // Create a JSON Web Token and sign it
//       const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
//         algorithm: "HS256",
//         expiresIn: "6h",
//       });

//       Plant.create({ latin, common, category, owner: req.user._id }).then(
//         (addPlant) => res.json({ addPlant: addPlant, authToken: authToken })
//       );
//     });
//   });
