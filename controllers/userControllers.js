const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

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
		res.status(500).json({ message: "error" });
	}
};

module.exports = {
	getAllUsers
};
