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

// PUT /api/services/:serviceId
router.put("/:serviceId", verifyToken, async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.payload._id);
  // console.log(req.params.serviceId);
  // res.send("PUT services route, all good here");
  const { title, type, description, unitPrice } = req.body;

  if (!title) {
    res.status(400).json({ message: "Title is required." });
    return;
  }

  try {
    const updatedService = {
      title,
      type,
      description,
      unitPrice,
    };
    if (Object.values(updatedService).includes(undefined)) {
      res.status(400).json({ message: "Incorrect request." });
      return;
    }

    const response = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, ownerId: req.payload._id },
      updatedService,
      { returnDocument: true, runValidators: true },
    );
    if (!response) {
      res.status(400).json({ message: "Service not found." });
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
