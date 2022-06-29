// changing the date & time formatting
const localDateFormatter = (createdAt) => {
	// format date
	let date = new Intl.DateTimeFormat("default", {
		year: "numeric", // 2022
		month: "short", // Jun
		day: "2-digit" // 28
	});

	const currentDate = date.format(createdAt);

	// format time
	// reference: https://stackoverflow.com/a/64895819
	// by OnlyZero
	let hours = createdAt.getHours();
	let minutes = createdAt.getMinutes();
	const ampm = hours >= 12 ? "pm" : "am";

	hours %= 12;
	hours = hours || 12;
	minutes = minutes < 10 ? `0${minutes}` : minutes;

	const currentTime = `${hours}:${minutes} ${ampm}`;

	return `${currentDate} at ${currentTime}`;
};

module.exports = localDateFormatter;
