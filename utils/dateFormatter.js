// changing the date & time formatting
const localDateFormatter = (createdAt) => {
	let date = new Intl.DateTimeFormat("default", {
		year: "numeric",    // 2022
		month: "short",     // Jun
		day: "2-digit",     // 28
		hour: "numeric",    // 4
		minute: "2-digit",  // 35
		hour12: true        // pm
	});
	return date.format(createdAt);
};

module.exports = localDateFormatter;
