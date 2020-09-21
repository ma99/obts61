export const SET_STOPS = (state, stops) => {
    state.availableStopList = stops;
}

export const SORT_SEATPLANS_BY_ID = (state) => {
    const seatplans = state.availableSeatPlanList;
    
    seatplans.sort((a, b) => {
        return a.id - b.id;
    });    
        
    state.availableSeatPlanList = seatplans;
}

export const ADD_STOP = (state, stops) => {	
	const availableStops = state.availableStopList;      
	
	// console.log('st=', stops);
	 console.log('lb=', availableStops.length)

	stops.forEach(stop => {
		availableStops.push(stop)
	});


	// data.forEach(stop => {
	// 	console.log(stop)
	// 	//availableStops.push(stop);
	// });     
	
	console.log('la=', availableStops.length)
    
    state.availableStopList = availableStops;
}

export const DELETE_SEATPLAN = (state, index) => {
    state.availableSeatPlanList.splice(index, 1);
}