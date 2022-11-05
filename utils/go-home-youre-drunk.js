function goHomeYoureDrunk(res, code = 401) {
  res.status(code).json({ errorMessage: "Nah na ah ah" });
}

module.exports = goHomeYoureDrunk;
