export const getRouteBy = (state) => (id) => {    
     return state.availableRouteList.find(route =>      
        route.id == id);      
}
export const cityRouteBy = (state) => (id) => {    
     return state.availableRoutesCities.find(route =>      
        route.id == id);      
}