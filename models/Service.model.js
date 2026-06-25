const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["services", "produits", "prestations"],
  },
  description: {
    type: String,
  },
  unitPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Service = model("Service", serviceSchema);

module.exports = Service;
