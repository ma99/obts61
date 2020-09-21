export const getSeatPlanBy = (state) => (id) => {         
    return state.availableSeatPlanList.find(seatplan => 
    	seatplan.id == id);     
}

export const getFareBy = (state) => (id) => {         
    return state.availableFareListByRoute.find(fare  => 
    	fare .id == id);     
}

export const getIndexOf = (state) => (fare) => {         
    return state.availableFareListByRoute.indexOf(fare);
}
