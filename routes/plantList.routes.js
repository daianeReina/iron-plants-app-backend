const { Router } = require("express");

const listPlantRouter = Router();

const { Plant } = require("../models/Plant.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const jwt = require("jsonwebtoken");
const isLoggedIn = require("../middleware/isLoggedIn");

listPlantRouter.get("/", isLoggedIn, (req, res, next) => {
  //Every single plant by the user
  Plant.find({ owner: req.user._id }).then((allplants) => res.json(allplants));
});

listPlantRouter.post("/add-plant", isLoggedIn, (req, res, next) => {
  const { latin, common, category } = req.body;
  //   console.log("Latin Name:", latin);

  //   console.log(req.user);

  Plant.findOne({ owner: req.user._id, latin }).then((possiblePlant) => {
    // console.log("POSSIBLE PLANT", possiblePlant.latin);
    // console.log("LATIN of plant", latin);

    if (possiblePlant) {
      return res
        .status(400)
        .json({ message: "This plant already exists in your list" });
    }

    Plant.create({ latin, common, category, owner: req.user._id }).then(
      (createdPlant) => {
        // Create an object that will be set as the token payload
        // const payload = { latin, common, category };

        // const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        //   algorithm: "HS256",
        //   expiresIn: "6h",
        // });

        res.json(createdPlant);
      }
    );
  });
});

module.exports = listPlantRouter;
