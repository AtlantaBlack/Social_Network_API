const router = require("express").Router();
const userRoutes = require("./userRoutes");
const thoughtRoutes = require("./thoughtRoutes");

// PATH: /api/users
router.use("/users", userRoutes);

// PATH: /api/thoughts
router.use("/thoughts", thoughtRoutes);

module.exports = router;
