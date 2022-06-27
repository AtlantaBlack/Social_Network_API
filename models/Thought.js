const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

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
			get: ukDateFormat // get the date in UK date format (dd/mm/yyyy)
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

// changing the date format
const ukDateFormat = (createdAt) => {
	let date = new Intl.DateTimeFormat("en-GB", {
		timeStyle: "short",
		dateStyle: "short"
	});
	return date.format(createdAt);

	// const date = new Date(createdAt); // date string from mongodb

	// const day = date.getDate();
	// const month = date.getMonth() + 1;
	// const year = date.getFullYear();

	// const ukDate = `${day}/${month}/${year}`;

	// console.log(date);
	// return dateInUK;
};

// create virtual for reactionCount that retrieves length of thought's reactions array
thoughtSchema.virtual("reactionCount").get(function () {
	return this.reactions.length;
});

// set up the model
const Thought = model("Thought", thoughtSchema);

// export thoughts
module.exports = Thought;
