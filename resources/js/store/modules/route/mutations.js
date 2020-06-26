export const SET_ROUTES = (state, routes) => {
    state.availableRouteList = routes;
}

export const SET_CITIES_BY_ROUTE = (state, cities) => {
    state.citiesByRoute = cities;
}

export const SORT_CITIES_BY_DISTANCE_FROM_DEPERTAURE_CITY = (state) => {
    const cities = state.citiesByRoute;
    
    cities.sort((a, b) => {
        return a.pivot.distance - b.pivot.distance;
    });    
        
    state.citiesByRoute = cities;
}

export const EMPTY_CITIES_BY_ROUTE = (state) => {
    state.citiesByRoute = [];
}
// export const SORT_SEATPLANS_BY_ID = (state) => {
//     const seatplans = state.availableSeatPlanList;
    
//     seatplans.sort((a, b) => {
//         return a.id - b.id;
//     });    
        
//     state.availableSeatPlanList = seatplans;
// }