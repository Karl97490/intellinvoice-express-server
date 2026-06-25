const router = require("express").Router();
const Service = require("../models/Service.model");
const verifyToken = require("../middlewares/auth.middlewares");

// POST /api/services/
router.post("/", verifyToken, async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.payload._id);
  // res.send("POST services route, all good here");
  const { title, type, description, unitPrice } = req.body;

  if (!title) {
    res.status(400).json({ message: "Title is required." });
    return;
  }

  try {
    const newService = {
      ownerId: req.payload._id,
      title,
      type,
      description,
      unitPrice,
    };
    await Service.create(newService);

    res.status(201).json({ message: "service created." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
