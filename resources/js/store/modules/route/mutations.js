export const ADD_ROUTE = (state, data) => {          
    state.availableRouteList.push(
        data);
}

export const DELETE_ROUTE = (state, index) => {
    state.availableRouteList.splice(index, 1);
}

export const SET_ROUTES = (state, routes) => {
    state.availableRouteList = routes;
}

export const SORT_ROUTES_BY_CITY_NAME = (state) => {
    state.availableRouteList.sort((a, b) => {
		var nameA = a.first_city.toUpperCase(); // ignore upper and lowercase
		var nameB = b.first_city.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
		return -1;
		}
		if (nameA > nameB) {
		return 1;
		}
		// names must be equal
		return 0;
    })
}

export const SORT_ROUTES_BY_DISTANCE = (state) => {
    state.availableRouteList.sort((a, b) => {
    	return a.distance - b.distance;
    })
}

export const SET_CITIES_BY_ROUTE = (state, cities) => {
    state.citiesByRoute = cities;

    // state.routeCityIdList = tempCities;
}

export const SORT_CITIES_BY_DISTANCE = (state) => {
    const cities = state.citiesByRoute;
    
    cities.sort((a, b) => {
        return a.pivot.distance - b.pivot.distance;
    });    
        
    state.citiesByRoute = cities;
}

export const EMPTY_CITIES_BY_ROUTE = (state) => {
    state.citiesByRoute = [];
}

export const SET_ROUTE_CITY_LIST = (state, cities) => {
    state.routeCityList = cities;
}

export const SET_ROUTES_CITIES = (state, routesCities) => {
    state.availableRoutesCities = routesCities ;
}

export const SET_CITY_ROUTE_LIST = (state, routes) => {
    state.cityRouteList = routes ;
}

// export const SORT_SEATPLANS_BY_ID = (state) => {
//     const seatplans = state.availableSeatPlanList;
    
//     seatplans.sort((a, b) => {
//         return a.id - b.id;
//     });    
        
//     state.availableSeatPlanList = seatplans;
// }