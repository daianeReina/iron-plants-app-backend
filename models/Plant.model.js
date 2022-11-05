const { Schema, model } = require("mongoose");
const { userCollectionName } = require("./User.model");

const plantSchema = new Schema(
  {
    common: {
      type: [String],
    },
    latin: {
      type: String,
    },
    category: {
      type: String,
    },
    // image: {
    //   type: String,
    // },
    owner: {
      type: Schema.Types.ObjectId,
      ref: userCollectionName,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);
const plantCollectionName = "Plant";
const Plant = model(plantCollectionName, plantSchema);

module.exports = { plantCollectionName, Plant };
