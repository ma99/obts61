export const ADD_BUS = (state, data) => {          
    state.availableBusList.push({
        bus: data.bus,
        total_seats: data.seats 
    })
}

export const DELETE_BUS = (state, index) => {
    state.availableBusList.splice(index, 1);
}

export const UPDATE_BUS = (state, data) => {

    let index = data.index;

    state.availableBusList[index].bus = {
        id: data.id,
        reg_no: data.bus.regNumber,
        number_plate: data.bus.numberPlate,
        type_id: data.bus.typeId,
        seat_plan_id: data.bus.seatPlanId,
        description: data.bus.description,
    }
}

export const SET_BUS_TYPES = (state, types) => {
    state.types = types;
}

export const SET_BUSES = (state, buses) => {
    state.availableBusList = buses;
}        

export const SORT_BUSES_BY_ID = (state) => {
    const buses = state.availableBusList;

    buses.sort((a, b) => {
        return a.bus.id - b.bus.id
    });

    state.availableBusList = buses;
}

export const SORT_BUSES_BY_REG_NUMBER = (state) => {
    const buses = state.availableBusList;

    buses.sort((a, b) => {
        let nameA = a.bus.reg_no; 
        let nameB = b.bus.reg_no; 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }            
        return 0;
    });

    state.availableBusList = buses;
}

// export const SET_SEATPLANS = (state, seatplans) => {
//     state.availableSeatPlanList = seatplans;
// },

// export const SORT_SEATPLANS_BY_ID = (state) => {
//     const seatplans = state.availableSeatPlanList;
    
//     seatplans.sort((a, b) => {
//         return a.id - b.id;
//     });
    
//     state.availableSeatPlanList = seatplans;
// },