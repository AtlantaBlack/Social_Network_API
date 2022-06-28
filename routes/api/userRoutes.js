const router = require("express").Router();

// get the controllers for user
const {
	getAllUsers,
	getUserById,
	createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
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

// PATH: /api/users/:userId/friends/:friendId
router.route("/:userId/friends/:friendId")
  .post(addFriend)
  .delete(removeFriend);

module.exports = router;
