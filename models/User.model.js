const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "fullName is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required."],
      unique: [true, "email is unique."],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    company: {
      name: { type: String, trim: true, required: true },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      phone: { type: String, trim: true },
      address: {
        type: String,
        trim: true,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = model("User", userSchema);

module.exports = User;
