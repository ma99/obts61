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

export const ADD_SEATPLAN = (state, seatplan) => {          
    state.availableSeatPlanList.push(seatplan);
}

export const DELETE_SEATPLAN = (state, index) => {
    state.availableSeatPlanList.splice(index, 1);
}