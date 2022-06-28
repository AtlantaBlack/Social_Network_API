const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up routes
app.use(routes);

db.once("open", () => {
	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}!`);
	});
});
