const { Schema, model } = require("mongoose");

const itemSchema = new Schema({
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
    enum: ["service", "product"],
  },
  unitPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Item = model("Item", itemSchema);

module.exports = Item;
