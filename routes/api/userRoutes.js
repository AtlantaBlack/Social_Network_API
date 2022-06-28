const router = require("express").Router();

// get the controllers for user
const {
	getAllUsers,
	getUserById,
	createUser
} = require("../../controllers/userControllers");

// PATH: /api/users
router.route("/")
  .get(getAllUsers)
  .post(createUser);

// PATH: /api/users/:userId
router.route("/:userId")
  .get(getUserById);

module.exports = router;
