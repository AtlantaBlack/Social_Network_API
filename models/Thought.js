const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const localDateFormatter = require("../utils/dateFormatter");

// thought schema
const thoughtSchema = new Schema(
	{
		thoughtText: {
			type: String,
			required: true,
			minLength: [1, "Please write your thought."],
			maxLength: [280, "Please keep your thought under 280 characters."]
		},
		createdAt: {
			type: Date,
			default: () => Date.now(), // set default to current timestamp
			get: localDateFormatter // get the date in UK date format (dd/mm/yyyy)
		},
		username: {
			type: String,
			required: true
		},
		reactions: [reactionSchema] // reactions to be nested here
	},
	{
		toJSON: {
			virtuals: true,
			getters: true
		},
		id: false
	}
);

// create virtual for reactionCount that retrieves length of thought's reactions array
thoughtSchema.virtual("reactionCount").get(function () {
	return this.reactions.length;
});

// set up the model
const Thought = model("Thought", thoughtSchema);

// export thoughts
module.exports = Thought;
