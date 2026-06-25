const router = require("express").Router();
const Invoice = require("../models/Invoice.model");
const verifyToken = require("../middlewares/auth.middlewares");

// POST /api/invoices/
router.post("/", verifyToken, async (req, res, next) => {
  console.log(req.body);
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
      invoiceNumber,
      status,
      issuedDate,
      dueDate,
      total,
    };
    await Invoice.create(newInvoice);

    res.status(200).json({ message: "invoice created." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
