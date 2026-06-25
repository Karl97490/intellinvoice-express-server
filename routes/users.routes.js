const router = require("express").Router();
const User = require("../models/User.model");
const verifyToken = require("../middlewares/auth.middlewares");

// GET /api/users/:userId
router.get("/:userId", verifyToken, async (req, res, next) => {
  // Check if the id in the payload match with the id in the request params
  if (req.payload._id !== req.params.userId) {
    res.status(401).json({ message: "Unauthorized access." });
    return;
  }

  try {
    const response = await User.findById(req.params.userId);
    if (!response) {
      res.status(400).json({ message: "User not found." });
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/:userId
router.patch("/:userId", verifyToken, async (req, res, next) => {
  // Check if the id in the payload match with the id in the request params
  if (req.payload._id !== req.params.userId) {
    res.status(401).json({ message: "Unauthorized access." });
    return;
  }

  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    res.status(400).json({ message: "First name and last name are required." });
    return;
  }

  const nameRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    res
      .status(400)
      .json({ message: "First name and last name are incorrect." });
    return;
  }

  try {
    const updatedUser = {
      firstName,
      lastName,
    };
    const response = await User.findByIdAndUpdate(
      req.params.userId,
      updatedUser,
      { returnDocument: true, runValidators: true },
    );
    if (!response) {
      res.status(400).json({ message: "User not found." });
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
