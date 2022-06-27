const { Schema, Types } = require("mongoose");

const reactionSchema = new Schema(
	{
		reactionId: {
			type: Schema.Types.ObjectId,
			default: () => new Types.ObjectId()
		},
		reactionBody: {
			type: String,
			required: true,
			maxLength: [280, "Please keep your reaction under 280 characters."]
		},
		username: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			default: () => Date.now(),
			get: ukDateFormat
		}
	},
	{
		toJSON: {
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
};

module.exports = reactionSchema;
