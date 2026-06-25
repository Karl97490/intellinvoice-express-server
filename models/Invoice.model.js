const { Schema, model } = require("mongoose");

const invoiceSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    invoiceNumber: {
      type: Number,
      required: [true, "InvoiceNumber is required."],
      unique: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "overdue", "pending"],
      default: "unpaid",
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Invoice = model("Invoice", invoiceSchema);

module.exports = Invoice;
