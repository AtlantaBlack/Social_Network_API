const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

// GET: find all the users
const getAllUsers = async (req, res) => {
	try {
		// look for all users
		const users = await User.find();

		// if there are no users, send err msg
		if (!users) {
			res.status(400).json({ message: "No users here" });
			return;
		}

		// if successful, send the user data
		res.status(200).json(users);
	} catch (error) {
		console.log("\n---USER CTRL: GET USERS ERR");
		console.log(error);
		res.status(500).json({ message: "Something went wrong!" });
	}
};

// GET: find a single user by id
const getUserById = async (req, res) => {
	try {
		const userId = req.params.userId;

		// find one user matching the id
		const user = await User.findOne({ _id: userId })
			// don't show the __v field
			.select("-__v")
			// populate the thoughts and friends fields
			.populate([
				{ path: "thoughts", select: "-__v" },
				{ path: "friends", select: "-__v" }
			]);

		// send the json
		res.status(200).json(user);
	} catch (error) {
		console.log("\n---USER CTRL: GET USER BY ID ERR");
		console.log(error);
		res.status(500).json({ message: "Something went wrong!" });
	}
};

// POST: create a new user
const createUser = async (req, res) => {
	try {
		/* req.body structure:
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
		const doesUserExist = await User.exists({ email });

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
		res.status(500).json({ message: "Something went wrong!" });
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	createUser
};
