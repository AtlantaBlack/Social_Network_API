const router = require("express").Router();

// get the controllers for user
const {
	getAllUsers,
	getUserById
} = require("../../controllers/userControllers");

// PATH: /api/users
router.route("/").get(getAllUsers);
// .post(addNewUser)

// PATH: /api/users/:userId
router.route("/:userId").get(getUserById);

module.exports = router;
