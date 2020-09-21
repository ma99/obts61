export const ADD_SCHEDULE = (state, data) => {          
    state.availableScheduleList.push(
        data);
}

export const DELETE_SCHEDULE = (state, index) => {
    state.availableScheduleList.splice(index, 1);
}

// export const ADD_SCHEDULES_BY_BUS = (state, data) => {          
//     state.schedulesByBus = data;
// }

// export const DELETE_SCHEDULE_BY_BUS = (state, index) => {
//     state.schedulesByBus.splice(index, 1);
// }

export const SET_SCHEDULES = (state, schedules) => {
    state.availableScheduleList = schedules;
}

// export const SET_SCHEDULES_BY_BUS = (state, schedules) => {
//     state.schedulesByBus = schedules;
// }
// export const EMPTY_SCHEDULES_BY_BUS = (state, schedules) => {
//     state.schedulesByBus = [];
// }

export const SORT_SCHEDULES_BY_DEPARTURE = (state, schedules) => {
    // const schedules = state.availableScheduleList;
    
    // schedules.sort((a, b) => {
    // 	let timeA = convertTime12To24(a.departure_time);
    // 	let timeB = convertTime12To24(b.departure_time);
        
    //     if (timeA < timeB) {
    //           return -1;
    //         }
    //         if (timeA > timeB) {
    //           return 1;
    //         }
    //         // names must be equal
    //         return 0;
    // });    
        
    state.availableScheduleList = schedules;
}