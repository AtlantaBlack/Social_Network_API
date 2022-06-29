const { User, Thought } = require("../models");

// validation check to see if a user exists
const searchForUser = async (condition) => {
	let exists = await User.exists(condition);
	if (exists) {
		return true;
	}
	return false;
};

// validation check to see if a thought exists
const searchForThought = async (condition) => {
	let exists = await Thought.exists(condition);
	if (exists) {
		return true;
	}
	return false;
};

module.exports = {
	searchForUser,
	searchForThought
};
