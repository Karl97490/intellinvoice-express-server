const router = require("express").Router();

// Authentification Routes
const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

module.exports = router;
