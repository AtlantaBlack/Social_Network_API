const { Schema, model } = require("mongoose");

// create schema
const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required"], // custom err msg
			trim: true,
			unique: true
		},
		email: {
			type: String,
			required: [true, "Email address is required"], // custom err msg
			trim: true,
			unique: true,
			lowercase: true,
			validate: {
				// custom validation for email
				// https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
				validator: function (v) {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
				},
				message: (props) => `${props.value} is not a valid email` // custom err msg
			}
		},
		thoughts: [{ type: Schema.Types.ObjectId, ref: "Thought" }],
		friends: [{ type: Schema.Types.ObjectId, ref: "User" }]
	},
	{
		toJSON: {
			virtuals: true // allow virtuals
		},
		id: false
	}
);

// create virtual for friendCount that returns length of user's friends array
userSchema.virtual("friendCount").get(function () {
	return this.friends.length;
});

// set up the model
const User = model("User", userSchema);

// export
module.exports = User;
