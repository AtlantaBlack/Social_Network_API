const router = require("express").Router();
const apiRoutes = require("./api");

// PATH: /api
router.use("/api", apiRoutes);

// wrong route
router.use((req, res) => res.send("Wrong route!"));

module.exports = router;
