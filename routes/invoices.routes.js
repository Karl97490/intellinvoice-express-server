const router = require("express").Router();
const Invoice = require("../models/Invoice.model");
const verifyToken = require("../middlewares/auth.middlewares");

// GET /api/invoices/
router.get("/", verifyToken, async (req, res, next) => {
  console.log(req.query);
  const filter = { ownerId: req.payload._id };
  const { search, status } = req.query;
  if (search) {
    filter.status = { $regex: search, $options: "i" };
  }
  console.log(filter);
  try {
    const response = await Invoice.find(filter);
    if (!response.length) {
      const response = await Invoice.find({ ownerId: req.payload._id });
      res.status(200).json(response);
      return;
    }
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/invoices/:invoiceId
router.get("/:invoiceId", verifyToken, async (req, res, next) => {
  try {
    const response = await Invoice.findOne({
      _id: req.params.invoiceId,
      ownerId: req.payload._id,
    });
    if (!response) {
      res.status(400).json({ message: "Invoice not found. " });
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices/
router.post("/", verifyToken, async (req, res, next) => {
  const {
    invoiceNumber,
    owner,
    client,
    items,
    status,
    issuedDate,
    dueDate,
    total,
  } = req.body;

  if (!invoiceNumber) {
    res.status(400).json({ message: "Invoice number is required." });
    return;
  }

  if (invoiceNumber < 1 || typeof invoiceNumber !== "string") {
    res.status(400).json({ message: "Invoice number is incorrect." });
    return;
  }

  if (!owner || !client) {
    res
      .status(400)
      .json({ message: "Owner and Client informations are required. " });
    return;
  }

  if (!owner?.name || !owner?.address) {
    res.status(400).json({ message: "Owner name and address are required." });
    return;
  }

  if (!client?.name || !client?.address) {
    res.status(400).json({ message: "Client name and address are required." });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res
      .status(400)
      .json({ message: "Invoice must contain at least one item." });
    return;
  }

  try {
    const foundInvoice = await Invoice.findOne({ invoiceNumber });
    if (foundInvoice) {
      res.status(400).json({ message: "Invoice number must be unique. " });
      return;
    }

    const newInvoice = {
      ownerId: req.payload._id,
      invoiceNumber,
      owner: {
        name: owner.name,
        email: owner.email,
        address: owner.address,
        phone: owner.phone,
      },
      client: {
        name: client.name,
        email: client.email,
        address: client.address,
        phone: client.phone,
      },
      items,
      status,
      issuedDate,
      dueDate,
      total,
    };
    await Invoice.create(newInvoice);

    res.status(201).json({ message: "invoice created." });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/invoices/:invoiceId
router.patch("/:invoiceId", verifyToken, async (req, res, next) => {
  const { items, issuedDate, dueDate, total } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res
      .status(400)
      .json({ message: "Invoice must contain at least one item." });
    return;
  }

  try {
    const updatedInvoice = {
      items,
      issuedDate,
      dueDate,
      total,
    };
    if (Object.values(updatedInvoice).includes(undefined)) {
      res.status(400).json({ message: "Incorrect request." });
      return;
    }

    const response = await Invoice.findOneAndUpdate(
      { _id: req.params.invoiceId, ownerId: req.payload._id },
      updatedInvoice,
      { returnDocument: true, runValidators: true },
    );
    if (!response) {
      res.status(400).json({ message: "Invoice not found." });
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/invoices/status/:invoiceId
router.patch("/status/:invoiceId", verifyToken, async (req, res, next) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ message: "Incorrect request." });
    return;
  }

  try {
    const response = await Invoice.findOneAndUpdate(
      { _id: req.params.invoiceId, ownerId: req.payload._id },
      { status },
      { returnDocument: true, runValidators: true },
    );
    if (!response) {
      res.status(400).json({ message: "Invoice not found." });
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/invoices/:invoiceId
router.delete("/:invoiceId", verifyToken, async (req, res, next) => {
  try {
    const response = await Invoice.findOneAndDelete({
      _id: req.params.invoiceId,
      ownerId: req.payload._id,
    });
    if (!response) {
      res.status(400).json({ message: "Invoice not found." });
      return;
    }

    res.status(200).json({ message: "invoice deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
