const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");
const { searchForUser, searchForThought } = require("../utils/search");

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
			res.status(400).json({ message: "This user does not exist." });
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
		// check to see if the incoming email is already in use
		const doesUserExist = await searchForUser({ email });
		// if so, then send an error message
		if (doesUserExist) {
			res.status(400).json({
				message: "Sorry, that email is already in use. Please try again."
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
				message: "Sorry, the user you are searching for doesn't exist."
			});
			return;
		}
		// if user exists, update them
		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId }, // find user with specified id
			{ $set: body }, // update using the req.body content
			{ runValidators: true, new: true } // run validators & save
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
			res.status(400).json({ message: "Sorry, that user doesn't exist." });
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

		// *** DELETE THOUGHTS ****

		// send success message
		res.status(200).json({ message: "User deleted." });
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
				message: "The user you're trying to add a friend to doesn't exist."
			});
			return;
		} else if (!doesFriendExist) {
			res.status(400).json({
				message: "The user being added as a friend doesn't exist."
			});
			return;
		}
		// disallow user to add themselves to their own friend list
		if (userId === friendId) {
			res.status(400).json({
				message: "Unfortunately, you can't add yourself as a friend."
			});
			return;
		}
		// update the user by adding the friend to their friends list (array)
		const userWithNewFriend = await User.findOneAndUpdate(
			{ _id: userId }, // grab user id
			{ $addToSet: { friends: friendId } }, // add friend to 'friends' field of the user
			{ runValidators: true, new: true }
		)
			.populate({ path: "friends", select: "-__v" }) // show the friends
			.select("-__v");

		// update the friend with the user's id added to the friend's friend list
		await User.findOneAndUpdate(
			{ _id: friendId }, // get friend id
			{ $addToSet: { friends: userId } }, // add user to the friend's 'friends' field
			{ runValidators: true, new: true }
		);
		// if successful, send data of user who added friend
		res.status(200).json(userWithNewFriend);
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
				message: "The user you're trying to add a friend to doesn't exist."
			});
			return;
		} else if (!doesFriendExist) {
			res.status(400).json({
				message: "The user being added as a friend doesn't exist."
			});
			return;
		}
		// if user tries to delete themselves as a friend, send error message
		if (userId === friendId) {
			res.status(400).json({
				message: "Please check the user IDs are correct."
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
		await User.findOneAndUpdate(
			{ _id: friendId },
			{ $pull: { friends: userId } }, // pull from friends
			{ runValidators: true, new: true }
		);
		// if successful, send data of user who is one friend fewer
		res.status(200).json(userWithOneLessFriend);
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
