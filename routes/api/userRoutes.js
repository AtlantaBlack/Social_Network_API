const router = require("express").Router();

// get the controllers for user
const {
	getAllUsers,
	getUserById,
	createUser,
  updateUser,
  deleteUser
} = require("../../controllers/userControllers");

// PATH: /api/users
router.route("/")
  .get(getAllUsers)
  .post(createUser);

// PATH: /api/users/:userId
router.route("/:userId")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
