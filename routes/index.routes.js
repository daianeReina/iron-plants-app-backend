const express = require("express");
const router = express.Router();

const profileRoutes = require("./profile.routes");

const plantRouter = require("./plant.routes");

router.get("/", (req, res, next) => {
  res.json({ hi: "All good in here " });
});

router.use("/profile", profileRoutes);

router.get("/plants", plantRouter);

module.exports = router;
