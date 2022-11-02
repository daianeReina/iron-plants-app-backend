const { Schema, model } = require("mongoose");

const plantSchema = new Schema({
  commonName: {
    type: [String],
  },
  latinName: {
    type: String,
  },
  family: {
    type: String,
  },
  category: {
    type: String,
  },
  origin: {
    type: String,
  },
  tempMin: {
    type: Number,
  },
  tempMax: {
    type: Number,
  },
  ideallight: {
    type: String,
  },
  toleratedlight: {
    type: String,
  },
  watering: {
    type: String,
  },
  insects: {
    type: [String],
  },
  diseases: {
    type: [String],
  },
  use: {
    type: [String],
  },
  image: {
    type: String,
  },
});

const Plant = model("Plant", plantSchema);

module.exports = Plant;
