const router = require("express").Router();
const userRoutes = require("./userRoutes");
const thoughtRoutes = require("./thoughtRoutes");

// path: /api/users
router.use("/users", userRoutes);

// path: /api/thoughts
// router.use("/thoughts", thoughtRoutes);

module.exports = router;
