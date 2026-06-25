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
      ownerId: req.payload._id,
      _id: req.params.invoiceId,
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
  // console.log(req.body);
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

module.exports = router;
