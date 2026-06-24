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

module.exports = router;
