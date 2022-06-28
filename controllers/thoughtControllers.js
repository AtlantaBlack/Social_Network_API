const { ObjectId } = require("mongoose");
const { User, Thought } = require("../models");
const localDateFormatter = require("../utils/dateFormatter");
const searchForUser = require("../utils/userSearch");

// ==== THOUGHTS: general ====

// GET: find all thoughts
const getAllThoughts = async (req, res) => {
	try {
		// search for all the thoughts
		const thoughts = await Thought.find()
			// hide the __v field
			.select("-__v");

		// if no thoughts, send err message
		if (!thoughts) {
			res.status(400).json({ message: "No one has made any thoughts..." });
			return;
		}
		// send thoughts data
		res.status(200).json(thoughts);
	} catch (error) {
		console.log("\n---THOUGHTS CTRL: GET THOUGHTS ERR");
		console.log(error);
		res.status(500).json({ message: "Something went wrong!" });
	}
};

// POST: add a new thought
const addThought = async (req, res) => {
	try {
		/* req.body structure for new thought: 
    {
      "thoughtText": "Here is some brain food",
      "username": "bobson dugnutt",
      "userId": "5edff358a0fcb779aa7b118b"
    }
    */
		// deconstruct req.body
		const { thoughtText, username, userId } = req.body;
		// make sure all fields are present in the body
		if (!thoughtText || !username || !userId) {
			res.status(400).json({
				message:
					"Please include text content, username, and corresponding user ID with your thought."
			});
			return;
		}
		// make sure the correct user exists (username matches ID)
		const doesUserExist = await searchForUser({ username, _id: userId });
		// send error if validation check for user fails
		if (!doesUserExist) {
			res.status(400).json({
				message:
					"We couldn't find the user! Please check the user ID matches the username."
			});
			return;
		}
		// create the thought
		const newThought = await Thought.create({ thoughtText, username, userId });
		// add thought to the user
		await User.findOneAndUpdate(
			{ _id: userId }, // find the user via ID
			{ $push: { thoughts: newThought._id } }, // add thought to their thoughts list
			{ new: true }
		);
		// if successful, send message
		res.status(200).json({ message: "Thought added!" });
	} catch (error) {
		console.log("\n---THOUGHTS CTRL: POST NEW THOUGHT ERR");
		console.log(error);
		res.status(500).json({ message: "Something went wrong!" });
	}
};

module.exports = {
	getAllThoughts,
	addThought
};
