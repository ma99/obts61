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

export const SORT_BUSES_BY_ID = (state, buses) => {
    state.availableBusList = buses;
}

export const SORT_BUSES_BY_REG_NUMBER = (state, buses) => {
    
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

export const SET_SCHEDULES_BY_BUS = (state, schedules) => {
    state.schedulesByBus = schedules;
}

export const ADD_SCHEDULES_BY_BUS = (state, data) => {          
    state.schedulesByBus = data;
}

export const DELETE_SCHEDULE_BY_BUS = (state, index) => {
    state.schedulesByBus.splice(index, 1);
}

export const EMPTY_SCHEDULES_BY_BUS = (state, schedules) => {
    state.schedulesByBus = [];
}

export const SORT_BUS_SCHEDULES_BY_CITY = (state, schedules) => {
    state.schedulesByBus = schedules;
}

export const SORT_BUS_SCHEDULES_BY_TIME = (state, schedules) => {
    state.schedulesByBus = schedules;
}