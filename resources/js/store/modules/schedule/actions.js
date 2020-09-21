import Schedule from '../../../api/schedule';

export const getSchedules = ({ commit, dispatch }) => {
    return Schedule.schedules().then(response => {
        commit('SET_SCHEDULES', response.data);
        // commit('SORT_SCHEDULES_BY_DEPARTURE');
        dispatch('sortSchedules');
    })
    .catch(error => {
            console.log(error.response.data);
    });
}

// export const getSchedulesByBus = ({ commit, dispatch }, id) => {
//     BusSchedule.schedules(id).then(response => {
//         commit('SET_SCHEDULES_BY_BUS', response.data);
//         // commit('SORT_SCHEDULES_BY_DEPARTURE');
//         //dispatch('sortSchedules');
//     })
//     .catch(error => {
//             console.log(error.response.data);
//             let errors = {"schedules":[error.response.data.message]};
//             commit('EMPTY_SCHEDULES_BY_BUS');
//             dispatch('setErrors', errors,
//              //error.response.data.message,
//                 { root: true }
//             );
//     });
// }

export const add = ({ commit, dispatch }, data) => {
    Schedule.store(data).then(response => {
        commit('ADD_SCHEDULE', response.data);
        dispatch('sortSchedules');
        dispatch('setSuccess', 
             {status: true},
            { root: true }
        );
    })
    .catch(error => {
        //console.log(error.response.data.message);
        dispatch('setErrors', 
             error.response.data.errors,
            { root: true }
        );
    });
}
// export const addSchedulesByBus = ({ commit, dispatch }, {data, id}) => {
//     BusSchedule.store(data, id).then(response => {
//         commit('ADD_SCHEDULES_BY_BUS', response.data);
//         dispatch('sortSchedules');
//         dispatch('setSuccess', 
//              {status: true},
//             { root: true }
//         );
//     })
//     .catch(error => {
//         //console.log(error.response.data.message);
//         dispatch('setErrors', 
//              error.response.data.errors,
//             { root: true }
//         );
//     });
// }

export const remove = ({ commit, state }, id) => {

        Schedule.delete(id).then(response => {
        
            let index = state.availableScheduleList.findIndex(schedule => schedule.id === id);
                        
            commit('DELETE_SCHEDULE', index);
        })
        .catch(error => {
            console.log(error.response.data);
        });
}

export const sortSchedules = ({ commit, state, rootGetters }) => {

	const schedules = state.availableScheduleList;

    schedules.sort((a, b) => {    	
    	return (
    		rootGetters.convertTime12To24(a.departure_time) - rootGetters.convertTime12To24(b.departure_time)
    		);
    });
  	commit('SORT_SCHEDULES_BY_DEPARTURE', schedules);    
}

// export const emptySchedulesByBus = ({ commit }) => { 
//         commit('EMPTY_SCHEDULES_BY_BUS');
// }