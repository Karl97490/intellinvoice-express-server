const router = require("express").Router();

// Authentification Routes
const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

// Users Routes
const userRouter = require("./users.routes");
router.use("/users", userRouter);

// Invoices Routes
const invoiceRouter = require("./invoices.routes");
router.use("/invoices", invoiceRouter);

// Clients Routes
const clientRouter = require("./clients.routes");
router.use("/clients", clientRouter);

module.exports = router;
