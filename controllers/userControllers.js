const { User, Thought } = require("../models");
const { searchForUser } = require("../utils/search");

// ==== USER: general ====

// GET: find all the users
const getAllUsers = async (req, res) => {
	try {
		// look for all users
		const users = await User.find()
			// don't show the __v field
			.select("-__v");

		// if there are no users, send err msg
		if (!users) {
			res.status(400).json({ message: "No users here..." });
			return;
		}
		// if successful, send the user data
		res.status(200).json(users);
	} catch (error) {
		console.log("\n---USER CTRL: GET USERS ERR");
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// GET: find a single user by id
const getUserById = async (req, res) => {
	try {
		const userId = req.params.userId; // get user id

		// find one user matching the id
		const user = await User.findOne({ _id: userId })
			// don't show the __v field
			.select("-__v")
			// populate the thoughts and friends fields
			.populate([
				{ path: "thoughts", select: "-__v" },
				{ path: "friends", select: "-__v" }
			]);

		// if user doesn't exist, send err message
		if (!user) {
			res.status(400).json({ message: "User could not be found." });
			return;
		}
		// otherwise, send the json
		res.status(200).json(user);
	} catch (error) {
		console.log("\n---USER CTRL: GET USER BY ID ERR");
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// POST: create a new user
const createUser = async (req, res) => {
	try {
		/* req.body structure for new user:
    {
      "username": "bob",
      "email": "bob@email.com"
    }
    */
		// deconstruct req.body
		const { username, email } = req.body;

		// check that both username and email have been received:
		// if not, send error message
		if (!username || !email) {
			res
				.status(400)
				.json({ message: "Please include a valid username and email." });
			return;
		}
		// check to see if the incoming username is already in use
		const doesUsernameExist = await searchForUser({ username });
		// if so, then send an error message
		if (doesUsernameExist) {
			res.status(400).json({
				message: `Sorry, the username '${username}' is already in use. Please try again.`
			});
			return;
		}
		// check to see if the incoming email is already in use
		const doesEmailExist = await searchForUser({ email });
		// if so, then send an error message
		if (doesEmailExist) {
			res.status(400).json({
				message: `Sorry, the email '${email}' is already in use. Please try again.`
			});
			return;
		}
		// else create the new user
		const newUser = await User.create({ username, email });
		// if successful, send the response
		res.status(200).json(newUser);
	} catch (error) {
		console.log("\n---USER CTRL: CREATE USER ERR");
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// PUT: update a single user
const updateUser = async (req, res) => {
	try {
		const userId = req.params.userId; // get the id
		const body = req.body; // get the body content

		// run a check to see if specified user actually exists
		const doesUserExist = await searchForUser({ _id: userId });
		// if not, send an error message
		if (!doesUserExist) {
			res.status(400).json({
				message: "Update user failed: User could not be found."
			});
			return;
		}
		// if user exists, update them
		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId }, // find user with specified id
			{ $set: body }, // update using the req.body content
			{ runValidators: true, new: true } // run validators & save
		);
		// update their thoughts to include username change
		await Thought.updateMany(
			// get the thought ids that are in their thoughts array
			{ _id: { $in: updatedUser.thoughts } },
			// change the username over
			{ $set: { username: updatedUser.username } }
		);
		// if successful, send json
		res.status(200).json(updatedUser);
	} catch (error) {
		console.log("\n---USER CTRL: UPDATE USER ERR");
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// DELETE: delete a user
const deleteUser = async (req, res) => {
	try {
		const userId = req.params.userId; // get id

		// see if user exists first
		const doesUserExist = await searchForUser({ _id: userId });
		// if they don't, send err msg
		if (!doesUserExist) {
			res
				.status(400)
				.json({ message: "Delete user failed: User could not be found." });
			return;
		}
		// if they do, delete the user
		const deletedUser = await User.findOneAndDelete({ _id: userId });
		// then delete the user off all the friend lists the user belongs to
		await User.updateMany(
			// get all user ids from the deleted user's friend list
			{ _id: { $in: deletedUser.friends } },
			// pull the deleted user's id
			{ $pull: { friends: userId } }
		);
		// then delete thoughts associated with deleted user
		await Thought.deleteMany(
			// get thought ids from the deleted user's thoughts array
			{ _id: { $in: deletedUser.thoughts } },
			// pull thoughts matching the deleted user's username
			{ $pull: { thoughts: deletedUser.username } }
		);
		// send success message
		res
			.status(200)
			.json({ message: `User deleted. Bye, ${deletedUser.username}!` });
	} catch (error) {
		console.log("\n---USER CTRL: DELETE USER ERR");
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// ==== USER: friends ====

// POST: add a friend
const addFriend = async (req, res) => {
	try {
		const userId = req.params.userId; // get user ID
		const friendId = req.params.friendId; // get friend ID

		// check if user exists
		const doesUserExist = await searchForUser({ _id: userId });
		// check if friend exists
		const doesFriendExist = await searchForUser({ _id: friendId });
		// send error messages if users or friends don't exist
		if (!doesUserExist) {
			res.status(400).json({
				message:
					"Add friend failed: The user you are trying to add a friend to could not be found."
			});
			return;
		} else if (!doesFriendExist) {
			res.status(400).json({
				message:
					"Add friend failed: The user who is being added as a friend could not be found."
			});
			return;
		}
		// disallow user to add themselves to their own friend list
		if (userId === friendId) {
			res.status(400).json({
				message:
					"Add friend failed: Unfortunately, you can't add yourself as a friend."
			});
			return;
		}
		// update the user by adding the friend to their friends list (array)
		const userWithNewFriend = await User.findOneAndUpdate(
			{ _id: userId }, // grab user id
			{ $addToSet: { friends: friendId } }, // add friend to 'friends' field of the user
			{ runValidators: true, new: true }
		)
			// show the friends
			.populate({ path: "friends", select: "-__v" })
			.select("-__v");

		// update the friend with the user's id added to the friend's friend list
		const newFriend = await User.findOneAndUpdate(
			{ _id: friendId }, // get friend id
			{ $addToSet: { friends: userId } }, // add user to the friend's 'friends' field
			{ runValidators: true, new: true }
		);
		// if successful, send cute message
		res.status(200).json({
			message: `${userWithNewFriend.username} and ${newFriend.username} are now friends!`
		});
	} catch (error) {
		console.log("\n---USER CTRL: ADD FRIEND ERR");
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// DELETE: delete a friend from the friends list
const removeFriend = async (req, res) => {
	try {
		const userId = req.params.userId; // get user id
		const friendId = req.params.friendId; // get friend id

		// check if they exist
		const doesUserExist = await searchForUser({ _id: userId });
		const doesFriendExist = await searchForUser({ _id: friendId });
		// send err messages if they don't
		if (!doesUserExist) {
			res.status(400).json({
				message:
					"Remove friend failed: The user you are trying to add a friend to could not be found."
			});
			return;
		} else if (!doesFriendExist) {
			res.status(400).json({
				message:
					"Remove friend failed: The user who is being added as a friend could not be found."
			});
			return;
		}
		// if user tries to delete themselves as a friend, send error message
		if (userId === friendId) {
			res.status(400).json({
				message: "Remove friend failed: Please check the user IDs are correct."
			});
			return;
		}
		// remove the friend thru updating the user's document
		const userWithOneLessFriend = await User.findOneAndUpdate(
			{ _id: userId },
			{ $pull: { friends: friendId } }, // pull from friends
			{ runValidators: true, new: true }
		)
			.populate({ path: "friends", select: "-__v" })
			.select("-__v");

		// remove the user from the friend's friends list
		const unfriended = await User.findOneAndUpdate(
			{ _id: friendId },
			{ $pull: { friends: userId } }, // pull from friends
			{ runValidators: true, new: true }
		);
		// if successful, send sad message
		res
			.status(200)
			.json(
				`${userWithOneLessFriend.username} is no longer friends with ${unfriended.username}.`
			);
	} catch (error) {
		console.log("\n---USER CTRL: REMOVE FRIEND ERR");
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	addFriend,
	removeFriend
};
