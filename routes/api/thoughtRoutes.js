const router = require("express").Router();

// get the controllers for thoughts
const {
	getAllThoughts,
	getThoughtById,
	addThought,
	updateThought,
	deleteThought,
	addReaction,
	removeReaction
} = require("../../controllers/thoughtControllers");

// PATH: /api/thoughts
router.route("/")
  .get(getAllThoughts)
  .post(addThought);

// PATH: /api/thoughts/:thoughtId
router.route("/:thoughtId")
	.get(getThoughtById)
	.put(updateThought)
	.delete(deleteThought);

// PATH: /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions")
  .post(addReaction)
  .delete(removeReaction);

module.exports = router;
