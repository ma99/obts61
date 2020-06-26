export const SET_SEATPLANS = (state, seatplans) => {
    state.availableSeatPlanList = seatplans;
}

export const SORT_SEATPLANS_BY_ID = (state) => {
    const seatplans = state.availableSeatPlanList;
    
    seatplans.sort((a, b) => {
        return a.id - b.id;
    });    
        
    state.availableSeatPlanList = seatplans;
}