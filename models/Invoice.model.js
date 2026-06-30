const { Schema, model } = require("mongoose");

const invoiceSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    invoiceNumber: {
      type: Number,
      required: [true, "InvoiceNumber is required."],
      unique: [true, "invoiceNumber is unique."],
      min: 1,
    },
    owner: {
      // firstName: { type: String, required: true, trim: true },
      // lastName: { type: String, required: true, trim: true },
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      address: { type: String, required: true, trim: true },
      phone: { type: String, trim: true },
    },
    client: {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      address: { type: String, required: true, trim: true },
      phone: { type: String, trim: true },
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
