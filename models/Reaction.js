const { Schema, Types } = require("mongoose");
const localDateFormatter = require("../utils/dateFormatter");

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
			default: () => Date.now(), // set to current timestamp
			get: localDateFormatter // get the date in UK format
		}
	},
	{
		toJSON: {
			getters: true
		},
		id: false
	}
);

module.exports = reactionSchema;
