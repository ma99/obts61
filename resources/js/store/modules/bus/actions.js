import Bus from '../../../api/bus';


    //axios.get('/api/types').then(response => {
    export const getBusTypes = ({ commit }) => {
        return Bus.types().then(response => {
            commit('SET_BUS_TYPES', response.data);
        })
    }

    export const getBuses = ({ commit, dispatch }) => {            
        return Bus.buses().then(response => {
            commit('SET_BUSES', response.data);
            dispatch('sortByBusId');
        })
    }

    export const sortByBusId = ({ commit, state }) => {
        const buses = state.availableBusList;

        buses.sort((a, b) => {
            return a.bus.id - b.bus.id
        });

        commit('SORT_BUSES_BY_ID', buses);
    }

    export const sortByRegNumber = ({ commit, state }) => {
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

        commit('SORT_BUSES_BY_REG_NUMBER', buses);
    }

    export const addBus = ({ commit }, { bus, numberOfSeat }) => {

        const data = {
            seat_plan_id: bus.seatPlanId,
            reg_no: bus.regNumber,
            number_plate: bus.numberPlate,
            type_id: bus.typeId,
            route_id:bus.routeId,
            description: bus.description
        }

        Bus.store(data).then(response => {
            const data = {
                bus: response.data,
                seats: numberOfSeat
            }
            commit('ADD_BUS', data);
        })
        .catch(error => {
            console.log(error.response.data);
        });
    }

    export const updateBus = ({ commit }, { bus, busToEdit }) => {
        
        const data = {
            seat_plan_id: bus.seatPlanId,
            reg_no: bus.regNumber,
            number_plate: bus.numberPlate,
            type_id: bus.typeId,
            route_id:bus.routeId,
            description: bus.description
        }
        
        Bus.update(data, busToEdit.id).then(response => {            
            const data = {
                bus: bus,
                index: busToEdit.index,
                id: busToEdit.id
            }
            commit('UPDATE_BUS', data);
        })
        .catch(error => {
            console.log(error.response.data);
        });
    }

    export const deleteBus = ({ commit, state }, id) => {

        Bus.delete(id).then(response => {
        
            let index = state.availableBusList.findIndex(bus => bus.bus.id === id);
                        
            commit('DELETE_BUS', index);
        })
        .catch(error => {
            console.log(error.response.data);
        });
    }

export const getSchedulesByBus = ({ commit, dispatch }, id) => {
    Bus.schedules(id).then(response => {
        try {
            commit('SET_SCHEDULES_BY_BUS', response.data);
            dispatch('sortBusSchedulesByTime');
        }       
        catch(e) {
            console.log(e);
        } 
    })
    .catch(error => {
            // console.log(error.response.data);
            let errors = {"schedules":[error.response.data.message]};
            commit('EMPTY_SCHEDULES_BY_BUS');
            dispatch('setErrors', errors,
             //error.response.data.message,
                { root: true }
            );
    });
}

export const addSchedulesByBus = ({ commit, dispatch }, {data, id}) => {
    Bus.attach(data, id).then(response => {
        commit('ADD_SCHEDULES_BY_BUS', response.data);
        dispatch('sortBusSchedulesByTime');
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

export const removeScheduleByBus = ({ commit, dispatch }, {schedule, bus}) => {

    Bus.detach(schedule, bus).then(response => {
      
        commit('SET_SCHEDULES_BY_BUS', response.data);
        dispatch('sortBusSchedulesByTime');
    })
    .catch(error => {
        console.log(error.response.data);
    });
}

export const emptySchedulesByBus = ({ commit }) => { 
    commit('EMPTY_SCHEDULES_BY_BUS');
}

export const sortBusSchedulesByCity = ({ commit, state, rootGetters }) => { 

    const schedules = state.schedulesByBus;
    //let tempSchedules = [] ;
    console.log('m=',schedules)

    schedules.forEach(schedule => {
        let city = rootGetters['city/getCityById'](schedule.pivot.departure_city_id);
        
        schedule.departure_city = city.name; 
    })
    //console.log(schedules);
    // schedules.sort((a, b) => {
    //     return 
    //     a.pivot.departure_city_id -      
    //     b.pivot.departure_city_id       
    // });

    schedules.sort((a, b) => {
        let nameA = a.departure_city.toUpperCase(); 
        let nameB = b.departure_city.toUpperCase(); 
        if (nameA < nameB) {
        return -1;
        }
        if (nameA > nameB) {
        return 1;
        }
        // names must be equal
        return 0;
    })

   commit('SORT_BUS_SCHEDULES_BY_CITY', schedules);
}

export const sortBusSchedulesByTime = ({ commit, getters, state, rootGetters }) => { 

    const schedules = state.schedulesByBus;

    schedules.sort((a, b) => {      
        return (
            rootGetters.convertTime12To24(a.departure_time) - rootGetters.convertTime12To24(b.departure_time)
            );
    });

   commit('SORT_BUS_SCHEDULES_BY_TIME', schedules);
}

