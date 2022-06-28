const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

// get (find) all the users
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();

		if (!users) {
			res.status(400).json({ message: "No users here" });
			return;
		}

		res.status(200).json(users);
	} catch (error) {
		console.log("\n---USER CTRL: GET USERS ERR");
		console.log(error);
		res.status(500).json({ message: "Something went wrong!" });
	}
};

// get a single user by id
const getUserById = async (req, res) => {
	try {
		const userId = req.params.userId;
		const user = await User.findOne({ _id: userId })
			.select("-__v")
			// populate the thoughts and friends fields
			.populate([
				{ path: "thoughts", select: "-__v" },
				{ path: "friends", select: "-__v" }
			]);

		res.status(200).json(user);
	} catch (error) {
		console.log("\n---USER CTRL: GET USER BY ID ERR");
		console.log(error);
		res.status(500).json({ message: "Something went wrong!" });
	}
};

module.exports = {
	getAllUsers,
	getUserById
};
