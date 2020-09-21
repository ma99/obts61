export const SET_FARES = (state, fares) => {
    state.availableFareList = fares;
}

export const SET_FARES_BY_ROUTE = (state, fares) => {
    state.availableFareListByRoute = fares;
}

export const ADD_FARE = (state, data) => { 
	// console.log('af=', data)         
    state.availableFareList.push(
        data);
}

export const DELETE_FARE = (state, index) => {
    state.availableFareList.splice(index, 1);
}

export const UPDATE_FARE = (state, fare) => { 

	 let index = fare.index;

    state.availableFareListByRoute[index] = {
        id: fare.id,
        city: fare.city.name,
        details: fare.details,
        distance: fare.city.distance,
        route: fare.route,
        updated_at: fare.updated_at,
    }

}
// export const SORT_SEATPLANS_BY_ID = (state) => {
//     const seatplans = state.availableSeatPlanList;
    
//     seatplans.sort((a, b) => {
//         return a.id - b.id;
//     });    
        
//     state.availableSeatPlanList = seatplans;
// }