const { ObjectId } = require("mongoose");
const { User, Thought } = require("../models");
const localDateFormatter = require("../utils/dateFormatter");
const { searchForUser, searchForThought } = require("../utils/search");

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
		res.status(500).json({ message: error.message });
	}
};

// GET: find a single thought by its id
const getThoughtById = async (req, res) => {
	try {
		const thoughtId = req.params.thoughtId; // get thought id

		// find the thought
		const thought = await Thought.findOne({ _id: thoughtId })
			// don't show __v field
			.select("-__v")
			.populate({ path: "reactions", select: "-__v" });

		// if thought doesn't exist, send err msg
		if (!thought) {
			res.status(400).json({ message: "No thought found with that ID." });
			return;
		}
		// else send the thought data
		res.status(200).json(thought);
	} catch (error) {
		console.log("\n---THOUGHTS CTRL: GET THOUGHT BY ID ERR");
		console.log(error);
		res.status(500).json({ message: error.message });
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
			{ runValidators: true, new: true } // make sure updated document gets returned
		);
		// if successful, send message
		res.status(200).json({ message: "Thought added!" });
	} catch (error) {
		console.log("\n---THOUGHTS CTRL: POST NEW THOUGHT ERR");
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// PUT: update thought by its id
const updateThought = async (req, res) => {
	try {
		const thoughtId = req.params.thoughtId; // get id
		const { thoughtText } = req.body; // get body content

		// search for existing thought
		const doesThoughtExist = await searchForThought({ _id: thoughtId });
		// if no thought found, send err msg
		if (!doesThoughtExist) {
			res.status(400).json({
				message:
					"Update failed: Could not find thought. Please check the thought ID is correct."
			});
			return;
		}
		// find and update the thought
		const updatedThought = await Thought.findOneAndUpdate(
			{ _id: thoughtId },
			{ $set: { thoughtText: thoughtText } }, // update the content
			{ runValidators: true, new: true }
		) // don't show the __v field
			.select("-__v");

		// if thoughtText isn't provided, say no changes were made
		if (!thoughtText) {
			res.status(400).json({
				message: "Update cancelled: No changes were made to thought content."
			});
			return;
		}
		// if successful, send the updated thought
		res.status(200).json(updatedThought);
	} catch (error) {
		console.log("\n---THOUGHTS CTRL: UPDATE THOUGHT ERR");
		console.log(error);
		res
			.status(500)
			.json({ message: "Something went wrong! (Invalid thought ID)" });
	}
};

// DELETE: delete a thought
const deleteThought = async (req, res) => {
	try {
		const thoughtId = req.params.thoughtId; // get id

		// see if the thought exists
		const doesThoughtExist = await searchForThought({ _id: thoughtId });
		// if no thought found, send err msg
		if (!doesThoughtExist) {
			res.status(400).json({
				message:
					"Delete failed: Could not find thought. Make sure the thought ID is correct."
			});
			return;
		}
		// otherwise go and delete the thought
		await Thought.findOneAndDelete({ _id: thoughtId });
		// send success msg
		res.status(200).json({ message: "Thought deleted!" });
	} catch (error) {
		console.log("\n---THOUGHTS CTRL: DELETE THOUGHT ERR");
		console.log(error);
		res
			.status(500)
			.json({ message: "Something went wrong! (Invalid thought ID)" });
	}
};

module.exports = {
	getAllThoughts,
	getThoughtById,
	addThought,
	updateThought,
	deleteThought
};
