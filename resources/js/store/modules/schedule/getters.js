// export const convertTime12To24 = (state) => (time12h) => {
// 	const [time, modifier] = time12h.split(' ');

// 	let [hours, minutes] = time.split(':');

// 	if (hours === '12') {
// 	hours = '00';
// 	}

// 	if ( modifier === 'PM' || modifier === 'pm') {
// 	hours = parseInt(hours, 10) + 12;
// 	}

// 	// return `${hours}:${minutes}`;
// 	return `${hours}${minutes}`;
// }