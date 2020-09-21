export const availableStopsBy = (state) => (id) => {
    const stops = state.availableStopList.filter(stop => 
        stop.city_id == id
        );
    // console.log ('st1', stops);

    stops.sort((a, b) => {
	
		let nameA = a.name.toUpperCase(); 
		
		let nameB = b.name.toUpperCase(); 

		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		// names must be equal
		return 0;
	});

	return stops;
}

// export const stopsByCityCount = (state, getters) => {
// 	console.log('mmsscc=', getters.availableStopsBy);
// 	console.log('sscc=', getters.availableStopsBy.length)
//     return getters.availableStopsBy.length;
//   }