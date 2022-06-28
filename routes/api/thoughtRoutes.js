const router = require("express").Router();

// get the controllers for thoughts
const {
  getAllThoughts,
  addThought
} = require('../../controllers/thoughtControllers');

// PATH: /api/thoughts
router.route("/")
  .get(getAllThoughts)
  .post(addThought);

// PATH: /api/thoughts/:thoughtId

// PATH: /api/thoughts/:thoughtId/reactions

module.exports = router;
