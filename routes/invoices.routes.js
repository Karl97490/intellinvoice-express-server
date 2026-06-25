const router = require("express").Router();
const Invoice = require("../models/Invoice.model");
const verifyToken = require("../middlewares/auth.middlewares");

// GET /api/invoices/
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const response = await Invoice.find({ ownerId: req.payload._id });
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
  const { invoiceNumber, status, issuedDate, dueDate, total } = req.body;

  if (!invoiceNumber) {
    res.status(400).json({ message: "Invoice number are required." });
    return;
  }

  if (invoiceNumber < 1 || typeof invoiceNumber !== "number") {
    res.status(400).json({ message: "Invoice number are incorrect." });
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
  const { issuedDate, dueDate, total } = req.body;

  try {
    const updatedInvoice = {
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
