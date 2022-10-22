const express = require("express");
const router = express.Router();

const profileRoutes = require("./profile.routes");

router.get("/", (req, res, next) => {
  res.json({ hi: "All good in here " });
});

router.use("/profile", profileRoutes);
module.exports = router;
