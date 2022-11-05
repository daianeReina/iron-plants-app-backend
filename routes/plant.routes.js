const express = require("express");
const plantRouter = express.Router();

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
// const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const axios = require("axios");

plantRouter.get("/plants", (req, res) => {
  const options = {
    method: "GET",
    url: "https://house-plants.p.rapidapi.com/all",
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "house-plants.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      //   console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

module.exports = plantRouter;
