export const has = (state) => (field) => {
    return state.errors.hasOwnProperty(field);
}

export const get = (state) => (field) => {
    if (state.errors[field]) {
        return state.errors[field][0];
    }
}

export const any = (state) => {
	//return Object.keys(state.errors).length > 0;
	return (Object.keys(state.errors).length > 0) ? true: false ;
}

export const convertTime12To24 = (state) => (time12h) => {
	const [time, modifier] = time12h.split(' ');

	let [hours, minutes] = time.split(':');

	if (hours === '12') {
	hours = '00';
	}

	if ( modifier === 'PM' || modifier === 'pm') {
	hours = parseInt(hours, 10) + 12;
	}

	// return `${hours}:${minutes}`;
	return `${hours}${minutes}`;
}