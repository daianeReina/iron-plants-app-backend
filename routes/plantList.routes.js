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

  Plant.findOne({ owner: req.user._id, latin }).then((possiblePlant) => {
    if (possiblePlant) {
      return res
        .status(400)
        .json({ message: "This plant already exists in your list" });
    }

    Plant.create({ latin, common, category, owner: req.user._id }).then(
      (createdPlant) => {
        res.json(createdPlant);
      }
    );
  });
});

// 🗑️ DELETE PLANT ********************
listPlantRouter.post("/delete-plant", isLoggedIn, (req, res, next) => {
  const { latin } = req.body;
  console.log("REQBODDYYY", req.body);

  Plant.findOne({ owner: req.user._id, latin }).then((foundPlant) => {
    console.log("Plant that user wants to delete:", foundPlant);

    const { _id } = foundPlant;

    console.log("IDDD da Planta", _id);

    Plant.findByIdAndDelete(_id).then(() => {
      const sim = true;

      res.json({ sucesso: sim });
    });
  });
});

module.exports = listPlantRouter;
