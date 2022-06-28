const { User } = require("../models");

// validation check to see if a user exists
const searchForUser = async (condition) => {
	let exists = await User.exists(condition);
	if (exists) {
		return true;
	}
	return false;
};

module.exports = searchForUser;
